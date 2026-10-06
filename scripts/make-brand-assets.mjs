// Renders the placeholder brand assets with Playwright:
//   public/favicon.ico (32×32 PNG inside an ICO), public/apple-touch-icon.png
//   (180×180) and public/og/default.png (1200×630).
// They show the name and the bridge mark only, never a claim.
// Run: npm run brand:assets (after any change to the mark or the name).
import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const out = (path) => join(ROOT, "public", path);

const font = async (path) => (await readFile(join(ROOT, "node_modules", path))).toString("base64");
const serif = await font("@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2");
const mono = await font("@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2");
const svg = await readFile(out("favicon.svg"), "utf8");

const fonts = `
  @font-face { font-family: "Serif"; src: url(data:font/woff2;base64,${serif}) format("woff2"); }
  @font-face { font-family: "Mono"; src: url(data:font/woff2;base64,${mono}) format("woff2"); }
  html, body { margin: 0; }`;

// fullBleed: iOS masks apple-touch icons itself, so it gets square ink corners.
const iconPage = (size, fullBleed = false) => `<!doctype html><style>${fonts}
  body { width: ${size}px; height: ${size}px; background: ${fullBleed ? "#111111" : "transparent"}; }
  svg { display: block; width: ${size}px; height: ${size}px; }
</style>${svg}`;

const ogPage = `<!doctype html><style>${fonts}
  body { width: 1200px; height: 630px; background: #f3f0e8; color: #111111; position: relative; overflow: hidden; }
  h1 { position: absolute; left: 80px; top: 170px; margin: 0; font: 400 136px/1 "Serif"; letter-spacing: -0.01em; }
  .deck { position: absolute; left: 0; right: 0; top: 352px; height: 14px; background: #ff4f00; }
  p { position: absolute; left: 80px; bottom: 72px; margin: 0; font: 500 28px/1 "Mono"; color: #686c73; }
</style><h1>Nassim Hassani</h1><div class="deck"></div><p>nassimelh01.github.io</p>`;

async function render(page, html, width, height, { transparent = false } = {}) {
  await page.setViewportSize({ width, height });
  await page.setContent(html);
  await page.evaluate("document.fonts.ready");
  return page.screenshot({ type: "png", clip: { x: 0, y: 0, width, height }, omitBackground: transparent });
}

// An ICO file that wraps a single PNG image (supported by every current browser).
function ico(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0);
  entry.writeUInt8(size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(6 + 16, 12);
  return Buffer.concat([header, entry, png]);
}

const browser = await chromium.launch(
  process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
);
const page = await browser.newPage();
await mkdir(out("og"), { recursive: true });
await writeFile(out("favicon.ico"), ico(await render(page, iconPage(32), 32, 32, { transparent: true }), 32));
await writeFile(out("apple-touch-icon.png"), await render(page, iconPage(180, true), 180, 180));
await writeFile(out("og/default.png"), await render(page, ogPage, 1200, 630));
await browser.close();
console.log("brand assets written: favicon.ico, apple-touch-icon.png, og/default.png");
