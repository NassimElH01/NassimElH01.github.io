import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

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
