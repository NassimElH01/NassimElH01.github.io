// Deploy gate: fails if the built site contains a "TODO:" or a data-todo marker.
//   npm run verify:no-todo               exit 1 on any hit (used on main)
//   npm run verify:no-todo -- --report   list hits, always exit 0 (used on PRs)
// Files copied unchanged from public/ (for example the freelance demo) are skipped.
import { access, readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const DIST = join(ROOT, "dist");
const PUBLIC = join(ROOT, "public");
const report = process.argv.includes("--report");

const exists = (path) => access(path).then(() => true, () => false);

async function* html(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* html(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

if (!(await exists(DIST))) {
  console.error("dist/ not found: run `npm run build` first.");
  process.exit(1);
}

const hits = [];
for await (const file of html(DIST)) {
  const rel = relative(DIST, file);
  if (await exists(join(PUBLIC, rel))) continue;
  const text = await readFile(file, "utf8");
  const todos = text.match(/TODO:[^<"]{0,80}/g) ?? [];
  const markers = (text.match(/data-todo/g) ?? []).length;
  if (todos.length || markers) hits.push({ rel, todos, markers });
}

for (const hit of hits) {
  console.log(`${hit.rel}: ${hit.todos.length} TODO text, ${hit.markers} data-todo marker(s)`);
  for (const todo of hit.todos.slice(0, 20)) console.log(`  ${todo.trim()}`);
}

if (!hits.length) {
  console.log("verify:no-todo: no TODOs in the built pages.");
} else if (report) {
  console.log(`verify:no-todo (report): ${hits.length} page(s) still contain TODOs.`);
} else {
  console.error(`verify:no-todo: ${hits.length} page(s) contain TODOs. Not deploying.`);
  process.exit(1);
}
