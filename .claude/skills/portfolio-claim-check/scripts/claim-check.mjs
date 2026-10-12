#!/usr/bin/env node
// portfolio-claim-check: a read-only check of the built site against CLAUDE.md rules 1-4 and the
// owner's <facts> and <pending>. It never writes a file.
//
//   npm run build
//   node .claude/skills/portfolio-claim-check/scripts/claim-check.mjs [--json]
//
// Hard failures (exit code 1): a phone number, a TODO, a word the facts rule out, something
// <pending> keeps hidden, third person, a confidential term (when _kilder/confidential-terms.txt
// exists), a PDF link other than the owner's CV.
// Advisory (exit code 0): content fields whose `# Source:` comment cites only the AI-written
// OWNER-PDF, only owner statements that are not in _kilder/, or no source at all. These are leads
// to check by hand against _kilder/ and <facts>; the script cannot read the sources themselves.
import { access, readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../../../", import.meta.url));
const DIST = join(ROOT, "dist");
const PUBLIC = join(ROOT, "public");
const asJson = process.argv.includes("--json");
const exists = (path) => access(path).then(() => true, () => false);

const hard = [];
const advisory = [];
const notes = [];

/* ───────── CLAUDE.md: the blocks the rules live in ───────── */

const claude = await readFile(join(ROOT, "CLAUDE.md"), "utf8");
const block = (tag) => claude.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1];
for (const tag of ["rules", "facts", "pending"]) {
  if (!block(tag)) hard.push({ rule: "CLAUDE.md", where: "CLAUDE.md", what: `<${tag}> block is missing` });
}

/* ───────── The built pages, as a visitor or a screen reader gets them ───────── */

if (!(await exists(DIST))) {
  console.error("dist/ not found: run `npm run build` first.");
  process.exit(2);
}

async function* pages(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* pages(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

const decode = (text) =>
  text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));

/** Text a visitor can read or hear: body text, structured data, alt/aria-label/title and meta content. */
function visibleText(html) {
  const jsonLd = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const attributes = [...html.matchAll(/\s(?:alt|aria-label|title|content)="([^"]*)"/g)].map((m) => m[1]);
  const body = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ");
  return decode([body, ...attributes, ...jsonLd].join(" \n ")).replace(/[ \t]+/g, " ");
}

/** A short excerpt around a match, for the report. */
const around = (text, index, length) => text.slice(Math.max(0, index - 50), index + length + 50).replace(/\s+/g, " ").trim();

// Words and patterns the rules and the owner's facts rule out. Each says where it comes from, so a
// change in CLAUDE.md shows which line to update here.
const FORBIDDEN = [
  { rule: "rule 4 (phone)", re: /\+45[\s\d]{8,}|\b\d{2} ?\d{2} ?\d{2} ?\d{2}\b(?![–-]\d)/g },
  { rule: "rule 4 (TODO)", re: /TODO/g },
  { rule: "facts: Profil (no Glostrup)", re: /Glostrup/gi },
  { rule: "facts: Profil (no Java)", re: /\bJava\b/g },
  { rule: "facts: Super User Guide (never 'officiel')", re: /\bofficiel\w*|\bofficial\w*/gi },
  { rule: "facts: Agile (no sprint cadence)", re: /sprint[\s-]?kadence\w*|sprint cadence/gi },
  { rule: "facts: Agile (Certificering, not Diplom)", re: /\bDiplom\w*/gi },
  { rule: "facts: Bevidst nedjusteret", re: /\bSRS\b|A\/B[\s-]?test\w*|issue[\s-]tracking|operationali[sz]\w*/gi },
  { rule: "facts: IBM (no 'highest distinction')", re: /højeste udmærkelse|highest distinction|with honou?rs/gi },
  { rule: "facts: IBM (no Danish grade)", re: /IBM[^.\n]{0,60}\b12\b|\b12\b[^.\n]{0,60}IBM/g },
  { rule: "facts: HF (no 'among the highest' without a source)", re: /årgangens højeste|among the highest/gi },
  { rule: "facts: Royal Unibrew (Jan-Jun 2025)", re: /2024\s*[–-]\s*2025[^\n]{0,70}Royal Unibrew|Royal Unibrew[^\n]{0,70}2024\s*[–-]\s*2025/g },
  { rule: "facts: Karakterer (web development grade not shown)", re: /Webudvikling (?:&|og) personligt salg|Web development (?:&|and) personal selling/gi },
  { rule: "rule 3 (OT: no NIS2)", re: /\bNIS ?2\b/gi },
  { rule: "pending 2/3 (posture checker hidden; no 'surveillance')", re: /surveillance|Femtech/gi },
  { rule: "pending 4 (physical computing hidden)", re: /physical computing/gi },
  { rule: "pending 5 (Matas hidden)", re: /\bMatas\b/g },
  { rule: "pending 6 (GenAI case hidden)", re: /Generative AI & Machine Learning elective|Generativ AI & machine learning \(valgfag\)/g },
];

// Third person about the owner (rule 4: first person). The display name itself is fine.
const THIRD_PERSON = {
  en: /\b(?:he|his|him|himself)\b|\bNassim(?:'s)?\s+(?!Hassani\b)[a-z]/gi,
  da: /\b(?:han|ham|hans)\b|\bNassims?\s+(?!Hassani\b)[a-zæøå]/gi,
};

const confidentialFile = join(ROOT, "_kilder", "confidential-terms.txt");
const confidential = (await exists(confidentialFile))
  ? (await readFile(confidentialFile, "utf8"))
      .split("\n")
      .map((line) => line.replace(/#.*/, "").trim())
      .filter(Boolean)
  : null;
if (!confidential) notes.push("_kilder/confidential-terms.txt is not here (e.g. a fresh clone): confidential terms were not checked.");

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
let pageCount = 0;

for await (const file of pages(DIST)) {
  const rel = relative(DIST, file);
  if (await exists(join(PUBLIC, rel))) continue; // copied unchanged from public/ (e.g. a demo)
  pageCount += 1;
  const html = await readFile(file, "utf8");
  const text = visibleText(html);
  const lang = html.match(/<html[^>]*\slang="([a-z]{2})"/)?.[1] ?? "en";

  if (/data-todo/.test(html)) hard.push({ rule: "rule 4 (TODO)", where: rel, what: "a data-todo marker in the HTML" });
  for (const href of html.matchAll(/href="(tel:[^"]*)"/g)) hard.push({ rule: "rule 4 (phone)", where: rel, what: href[1] });
  for (const href of html.matchAll(/href="([^"]+\.pdf)"/gi)) {
    if (!/^\/?Nassim-Hassani-CV\.pdf$/.test(href[1])) hard.push({ rule: "rule 6 (CV)", where: rel, what: `PDF link ${href[1]}` });
  }

  for (const { rule, re } of FORBIDDEN) {
    for (const match of text.matchAll(re)) hard.push({ rule, where: rel, what: around(text, match.index, match[0].length) });
  }
  for (const match of text.matchAll(THIRD_PERSON[lang] ?? THIRD_PERSON.en)) {
    hard.push({ rule: "rule 4 (first person)", where: rel, what: around(text, match.index, match[0].length) });
  }
  for (const term of confidential ?? []) {
    const re = new RegExp(`(?<![\\p{L}\\d])${escape(term)}(?![\\p{L}\\d])`, "giu");
    if (re.test(text)) hard.push({ rule: "rules 2-3 (confidential)", where: rel, what: "a confidential term (not repeated here; see _kilder/confidential-terms.txt)" });
  }
}
if (pageCount === 0) hard.push({ rule: "build", where: "dist/", what: "no built pages to check" });

/* ───────── content/: what each visible field cites ───────── */

// Keys whose values the site renders (see src/components/). Comments are never rendered.
const VISIBLE = /^\s*(?:-\s+)?(title|year|start|end|context|problem|role|method|result|keyline|summary|responsibilities|technology|grades|note|gloss|scope|name|issuer|level|organization|headline|tagline|availability|location|label|grade):/;
const KINDS = [
  ["kilder", /\b(?:REPORT|BACHELOR|EXAM(?:-DTI)?|CV-2|CV-CBS|CV \(|Nassim_Hassani_CV)\b|owner(?:'s answers?)?(?: of)? \(?2026-10-(?:06|11|12)|owner-answers|_kilder\//],
  ["facts", /CLAUDE\.md|<facts>|<pending>|\bthe brief\b|BRIEF\b/],
  ["repo", /git history|legacy\/|OLD-SITE|projectsData|cvData|translations\.ts|package\.json|public\//],
  ["owner-not-in-kilder", /owner(?:'s answers?)?(?: of)? \(?2026-10-0[45]|LinkedIn|OWNER\b(?!-PDF)/],
  ["owner-pdf", /OWNER-PDF/],
];
const kindsOf = (comment) => KINDS.filter(([, re]) => re.test(comment)).map(([kind]) => kind);

async function* contentFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* contentFiles(path);
    else if (/\.(md|ya?ml)$/.test(entry.name) && !entry.name.startsWith("_")) yield path;
  }
}

for await (const file of contentFiles(join(ROOT, "content"))) {
  const rel = relative(ROOT, file);
  const raw = await readFile(file, "utf8");
  const source = rel.endsWith(".md") ? (raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "") : raw;
  if (/^draft: true$/m.test(source)) continue;
  const lines = source.split("\n");
  // The comment at the top of the file speaks for every field that has none of its own.
  const header = lines.slice(0, lines.findIndex((line) => !/^\s*(#|$)/.test(line))).join("\n");
  let pending = [];
  // The comment that speaks for each indentation level: a nested field (an en/da value, a grade,
  // a skill's note) with no comment of its own is covered by its parent's.
  const cover = new Map();
  lines.forEach((line, index) => {
    if (/^\s*#/.test(line)) {
      pending.push(line);
      return;
    }
    const anyKey = line.match(/^(\s*)(?:-\s+)?[\w-]+:/);
    if (!anyKey) return;
    const indent = anyKey[1].length + (/^\s*-\s/.test(line) ? 2 : 0);
    const mine = pending.join("\n");
    pending = [];
    for (const level of [...cover.keys()]) if (level >= indent) cover.delete(level);
    const parent = [...cover.entries()].filter(([level]) => level < indent).sort((a, b) => b[0] - a[0])[0]?.[1] ?? "";
    const own = mine || parent;
    cover.set(indent, own);
    const key = line.match(VISIBLE)?.[1];
    if (!key) return;
    // A value that is a TODO (here or in its en/da lines just below) is hidden on the site.
    const value = [line, lines[index + 1] ?? "", lines[index + 2] ?? ""].join("\n");
    if (/TODO:/.test(value) && !/^\s*(?:-\s+)?\w+:\s*\S/.test(line.replace(/TODO:.*/, ""))) return;
    if (/:\s*"?TODO:/.test(line)) return;
    const kinds = kindsOf(own).length ? kindsOf(own) : kindsOf(header);
    const where = `${rel}:${index + (rel.endsWith(".md") ? 2 : 1)} ${key}`;
    if (kinds.length === 0) advisory.push({ kind: "no source comment", where });
    else if (!kinds.some((kind) => ["kilder", "facts", "repo"].includes(kind))) {
      advisory.push({ kind: kinds.includes("owner-pdf") && !kinds.includes("owner-not-in-kilder") ? "OWNER-PDF only" : "owner statement not in _kilder/", where });
    }
  });
}

/* ───────── Report ───────── */

if (asJson) {
  console.log(JSON.stringify({ hard, advisory, notes }, null, 2));
} else {
  console.log(`portfolio-claim-check: ${pageCount} page(s), ${hard.length} hard failure(s), ${advisory.length} advisory lead(s)\n`);
  for (const item of hard) console.log(`FAIL  [${item.rule}] ${item.where}: ${item.what}`);
  if (hard.length) console.log("");
  const byKind = Object.groupBy ? Object.groupBy(advisory, (item) => item.kind) : advisory.reduce((acc, item) => ((acc[item.kind] ??= []).push(item), acc), {});
  for (const [kind, items] of Object.entries(byKind)) {
    console.log(`LEAD  ${kind} (${items.length}):`);
    for (const item of items) console.log(`      ${item.where}`);
  }
  for (const note of notes) console.log(`NOTE  ${note}`);
}
process.exit(hard.length ? 1 : 0);
