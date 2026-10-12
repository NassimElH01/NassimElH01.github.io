import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page } from "@playwright/test";

export const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/** axe on the settled page (the decode intro hides letters for up to 1.6 s), optionally one part of it. */
export async function axe(page: Page, include?: string) {
  await page.waitForFunction(
    () => !document.documentElement.classList.contains("intro") && !document.querySelector(".intro-skip"),
  );
  const builder = new AxeBuilder({ page }).withTags(WCAG);
  if (include) builder.include(include);
  const results = await builder.analyze();
  return results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

/** The YAML frontmatter of a Markdown file in content/. */
export function frontmatter(source: string): string {
  return source.split(/^---$/m)[1];
}

export const isTodo = (value: string) => value.trimStart().startsWith("TODO:");

/**
 * The browser's default font size, as Chrome's font-size setting sets it. Unlike
 * html { font-size: 200% }, it also changes what rem means in media and container queries.
 * Call it before page.goto.
 */
export async function setDefaultFontSize(page: Page, px: number) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Page.setFontSizes", { fontSizes: { standard: px, fixed: px } });
}

/** Waits until the page has not scrolled for six frames (smooth scrolling, a row opening). */
export async function waitForScrollEnd(page: Page) {
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            new Promise<boolean>((done) => {
              const start = scrollY;
              let frames = 0;
              const tick = () => (scrollY !== start ? done(false) : ++frames >= 6 ? done(true) : requestAnimationFrame(tick));
              requestAnimationFrame(tick);
            }),
        ),
      { intervals: [100] },
    )
    .toBe(true);
}

/**
 * A link landed on `target` where a visitor sees it: once scrolling has stopped, it starts
 * below the sticky header and is what is drawn there. toBeInViewport() also passes under the
 * header, and a check made mid-scroll can pass on the way down. `above` is a line over the
 * target that must stay in view with it (a featured project's "01 · year · context").
 */
export async function expectClearOfHeader(target: Locator, above?: Locator) {
  const page = target.page();
  await waitForScrollEnd(page);
  const header = await page.locator("body > header").evaluate((element) => element.getBoundingClientRect().bottom);
  const landed = await target.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const hit = document.elementFromPoint(box.left + 4, box.top + 4);
    return { top: box.top, drawn: hit !== null && element.contains(hit) };
  });
  expect(landed.top, `target top ${landed.top} vs header bottom ${header}`).toBeGreaterThanOrEqual(header - 0.5);
  expect(landed.drawn, "the target is what is drawn at its top left corner").toBe(true);
  if (above) {
    const top = await above.evaluate((element) => element.getBoundingClientRect().top);
    expect(top, `line above the target at ${top} vs header bottom ${header}`).toBeGreaterThanOrEqual(header - 0.5);
  }
}

/**
 * The 3px ink bar a landing target draws in its gutter, as ::before's content, width and
 * colour. `content` is what proves it is drawn: Chromium reports the width and colour even
 * when no box is generated.
 */
export const LANDED = ['""', "3px", "rgb(17, 17, 17)"];

/** Every entry in Skills, Projects and Experience that draws a landing bar, as [its anchor's id, ...bar]. */
export const landingBars = (page: Page) =>
  page.locator(".entry, .featured, .more-row, .timeline-entry").evaluateAll((holders) =>
    holders.flatMap((holder) => {
      const bar = getComputedStyle(holder, "::before");
      return bar.content === "none" ? [] : [[holder.querySelector("[id]")!.id, bar.content, bar.width, bar.backgroundColor]];
    }),
  );
