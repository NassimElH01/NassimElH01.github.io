import { test } from "@playwright/test";

// Not a visual-regression test: it saves review screenshots to screenshots/
// (gitignored) at the widths and themes the owner's /review-design asks for.
const WIDTHS = [375, 768, 1440];
const SCHEMES = ["light", "dark"] as const;
const PAGES = [
  { path: "/", name: "home-en" },
  { path: "/da/", name: "home-da" },
];

for (const { path, name } of PAGES) {
  for (const width of WIDTHS) {
    for (const colorScheme of SCHEMES) {
      test(`screenshot ${name} ${width}px ${colorScheme}`, async ({ browser }) => {
        const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme });
        const page = await context.newPage();
        await page.goto(path, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: `screenshots/${name}-${width}-${colorScheme}.png`, fullPage: true });
        await context.close();
      });
    }
  }
}
