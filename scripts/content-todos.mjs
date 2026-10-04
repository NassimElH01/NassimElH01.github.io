// Lists every "TODO:" left in content/ so the owner sees what is missing.
//   npm run content:todos              report only (always exits 0)
//   npm run content:todos -- --strict  exits 1 if published content has a TODO
// Values are read by parsing YAML (and Markdown frontmatter), so comments never
// count. Not published, so reported but never blocking:
//   - files whose name starts with "_"            (skipped entirely)
//   - Markdown entries with `draft: true`          (drafts only show in dev)
//   - list items with `confirm: true`              (hidden until confirmed)
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CONTENT = join(ROOT, "content");
const strict = process.argv.includes("--strict");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (/\.(md|ya?ml)$/.test(entry.name)) yield path;
  }
}

/** Collects every string value containing "TODO:" with its key path. */
function collect(node, path, hidden, out) {
  if (typeof node === "string") {
    if (node.includes("TODO:")) out.push({ path, value: node, hidden });
  } else if (Array.isArray(node)) {
    node.forEach((item, index) => {
      const confirmItem = item !== null && typeof item === "object" && item.confirm === true;
      collect(item, `${path}[${index}]`, hidden || confirmItem, out);
    });
  } else if (node !== null && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) collect(value, path ? `${path}.${key}` : key, hidden, out);
  }
}

function parse(file, text) {
  if (!file.endsWith(".md")) return { data: load(text), body: "" };
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: null, body: text };
  return { data: load(match[1]), body: text.slice(match[0].length) };
}

let total = 0;
let blocking = 0;
for await (const file of walk(CONTENT)) {
  const text = await readFile(file, "utf8");
  const { data, body } = parse(file, text);
  const draft = data !== null && typeof data === "object" && data.draft === true;

  const hits = [];
  collect(data, "", false, hits);
  body.split("\n").forEach((line, index) => {
    if (line.includes("TODO:")) hits.push({ path: `body:${index + 1}`, value: line.trim(), hidden: false });
  });
  if (!hits.length) continue;

  const fileBlocking = draft ? 0 : hits.filter((hit) => !hit.hidden).length;
  total += hits.length;
  blocking += fileBlocking;
  console.log(`\n${relative(ROOT, file)}${draft ? "  (draft)" : ""}: ${hits.length}`);
  for (const hit of hits) {
    const marker = hit.hidden ? "  (hidden: confirm)" : "";
    console.log(`  ${hit.path}: ${hit.value.slice(0, 140)}${marker}`);
  }
}

console.log(`\n${total} TODO(s) in content/, ${blocking} in published content.`);
if (strict && blocking > 0) {
  console.error("content:todos --strict: published content still has TODOs.");
  process.exit(1);
}
