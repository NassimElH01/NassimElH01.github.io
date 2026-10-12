import { readdirSync, readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { load } from "js-yaml";
import { axe, frontmatter, isTodo } from "./helpers";

type Localized = Record<"en" | "da", string>;
interface Entry {
  id: string;
  kind: string;
  title: Localized;
  summary: Localized;
  organization: string;
  grades?: { label: Localized; grade: string }[];
  undated?: boolean;
  draft?: boolean;
  order: number;
}

// The entries Experience shows, read from content/timeline the way getRenderedTimeline() reads them.
const known = (field: Localized) => !isTodo(field.en) || !isTodo(field.da);
const entries: Entry[] = readdirSync("content/timeline")
  .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
  .map((file) => ({
    id: file.replace(/\.md$/, ""),
    ...(load(frontmatter(readFileSync(`content/timeline/${file}`, "utf8"))) as Omit<Entry, "id">),
  }))
  .filter((entry) => !entry.draft && !isTodo(entry.kind) && known(entry.title) && known(entry.summary))
  .sort((a, b) => a.order - b.order);
const work = entries.filter((entry) => entry.kind !== "education");
const education = entries.filter((entry) => entry.kind === "education");
const graded = education.filter((entry) => entry.grades?.length);

const CASES = {
  en: {
    path: "/",
    heading: "Experience & education",
    grades: "Grades",
    periods: {
      "ruc-master-digital-transformation": "Sep 2026 – expected Jun 2028",
      "zealand-professionsbachelor": "2022 – Jan 2026",
      "royal-unibrew-pmo": "2025",
      "ss-rengoringservice": "2023–now",
    },
  },
  da: {
    path: "/da/",
    heading: "Erfaring & uddannelse",
    grades: "Karakterer",
    periods: {
      "ruc-master-digital-transformation": "sep. 2026 – forventet jun. 2028",
      "zealand-professionsbachelor": "2022 – jan. 2026",
      "royal-unibrew-pmo": "2025",
      "ss-rengoringservice": "2023–nu",
    },
  },
} as const;

const article = (id: string) => `section#experience article[aria-labelledby="timeline-${id}"]`;

for (const lang of ["en", "da"] as const) {
  const item = CASES[lang];

  test.describe(`Experience on ${item.path}`, () => {
    test("lists work, then education, each under its own anchor", async ({ page }) => {
      await page.goto(item.path);
      const section = page.locator("section#experience");
      await expect(section.getByRole("heading", { level: 2 })).toHaveText(item.heading);
      const titles = (list: Entry[]) => list.map((entry) => (isTodo(entry.title[lang]) ? entry.title.en : entry.title[lang]));
      await expect(section.locator("article h4")).toHaveText([...titles(work), ...titles(education)]);
      for (const entry of entries) {
        // The heading is the anchor Skills links to, and it names its article.
        const heading = section.locator(`h4#timeline-${entry.id}`);
        await expect(heading).toHaveAttribute("tabindex", "-1");
        await expect(page.locator(article(entry.id))).toHaveCount(1);
      }
      await expect(section.locator("[data-todo]:visible")).toHaveCount(0);
      await expect(section).not.toContainText("TODO");
    });

    test("shows periods with months, the expected end and an open end", async ({ page }) => {
      await page.goto(item.path);
      for (const [id, period] of Object.entries(item.periods)) {
        await expect(page.locator(`${article(id)} .timeline-meta`)).toHaveText(new RegExp(`^${period}`));
      }
      // Every dated entry shows a year; an undated one (the CVs list some without dates) shows
      // its kind only, never an empty period.
      for (const entry of entries) {
        const meta = page.locator(`${article(entry.id)} .timeline-meta`);
        if (entry.undated) await expect(meta).not.toHaveText(/\d/);
        else await expect(meta).toHaveText(/\d{4}/);
      }
    });

    test("lists each education's grades from content/, label then grade", async ({ page }) => {
      await page.goto(item.path);
      expect(graded.length).toBeGreaterThan(0);
      for (const entry of graded) {
        const grades = page.locator(article(entry.id)).getByRole("list", { name: item.grades });
        await expect(grades.locator("li")).toHaveText(entry.grades!.map((grade) => `${grade.label[lang]} ${grade.grade}`));
      }
    });
  });
}

test("screen readers get the period and the grades with spaces", async ({ page }) => {
  await page.goto("/");
  const ruc = await page.locator(article("ruc-master-digital-transformation")).ariaSnapshot();
  expect(ruc).toContain("Sep 2026 – expected Jun 2028");
  expect(ruc).toMatch(/heading "MSc in Digital Transformation"/);
  expect(await page.locator(`${article("zealand-professionsbachelor")} .grades`).ariaSnapshot()).toContain(
    "listitem: Internship exam (PMO) 12",
  );
});

test("Experience fits a 320px phone with every disclosure open", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 800 } });
  const page = await context.newPage();
  await page.goto("/da/");
  await page.locator("section#experience details").evaluateAll((all) => all.forEach((details) => details.setAttribute("open", "")));
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await context.close();
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`Experience has no axe violations with disclosures open (${colorScheme})`, async ({ browser }) => {
    const context = await browser.newContext({ colorScheme });
    const page = await context.newPage();
    await page.goto("/");
    await page.locator("section#experience details").evaluateAll((all) => all.forEach((details) => details.setAttribute("open", "")));
    expect(await axe(page, "section#experience")).toEqual([]);
    await context.close();
  });
}
