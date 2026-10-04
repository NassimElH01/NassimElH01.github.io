// Lists every "TODO:" left in content/ so the owner sees what is missing.
//   npm run content:todos              report only (always exits 0)
//   npm run content:todos -- --strict  exits 1 if a published entry has a TODO
// Files starting with "_" are never published and are skipped. Markdown entries
// with `draft: true` are reported but do not fail --strict.
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
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

const isDraft = (text) => /^---[\s\S]*?^draft:\s*true\s*$[\s\S]*?^---/m.test(text);

let total = 0;
let blocking = 0;
for await (const file of walk(CONTENT)) {
  const text = await readFile(file, "utf8");
  const lines = text.split("\n");
  const hits = lines.flatMap((line, index) => (line.includes("TODO:") ? [{ line: index + 1, text: line.trim() }] : []));
  if (!hits.length) continue;
  const draft = file.endsWith(".md") && isDraft(text);
  total += hits.length;
  if (!draft) blocking += hits.length;
  console.log(`\n${relative(ROOT, file)}${draft ? "  (draft)" : ""}: ${hits.length}`);
  for (const hit of hits) console.log(`  ${hit.line}: ${hit.text.slice(0, 160)}`);
}

console.log(`\n${total} TODO(s) in content/, ${blocking} in published entries.`);
if (strict && blocking > 0) {
  console.error("content:todos --strict: published content still has TODOs.");
  process.exit(1);
}
