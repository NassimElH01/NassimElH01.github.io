import { readdirSync, readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { load } from "js-yaml";
import { axe } from "./helpers";

type Lang = "en" | "da";
type Localized = Record<Lang, string>;
interface Usage {
  context: string;
  timeline?: string;
  project?: string;
  note?: Localized;
  scope?: Localized;
}
interface Item {
  id: string;
  name: Localized;
  confirm?: boolean;
  usedIn: Usage[] | string;
}
interface Group {
  id: string;
  group: Localized;
  order: number;
  items: Item[];
}

// The skills, read from content/skills the way Skills.astro reads them: an item shows when it
// has evidence (usedIn is a list) and is not awaiting the owner's confirmation.
const groups: Group[] = readdirSync("content/skills")
  .filter((file) => file.endsWith(".yaml") && !file.startsWith("_"))
  .map((file) => ({ id: file.replace(/\.yaml$/, ""), ...(load(readFileSync(`content/skills/${file}`, "utf8")) as Omit<Group, "id">) }))
  .sort((a, b) => a.order - b.order);
const shown = (group: Group) => group.items.filter((item) => !item.confirm && Array.isArray(item.usedIn));
const usages = (item: Item) => item.usedIn as Usage[];
const items = groups.flatMap(shown);
const hidden = groups.flatMap((group) => group.items).filter((item) => !items.includes(item));
const CONTEXTS = ["internship", "work", "freelance", "study", "personal"] as const;
const usedIn = (item: Item, context: string) => usages(item).some((usage) => usage.context === context);

const LABELS = {
  en: { legend: "Skills used in", all: "All", unit: "skills", internship: "Internship", work: "Work", freelance: "Freelance", study: "Study", personal: "Personal" },
  da: { legend: "Kompetencer brugt i", all: "Alle", unit: "kompetencer", internship: "Praktik", work: "Arbejde", freelance: "Freelance", study: "Studie", personal: "Personligt" },
} as const;

const pickedName = (item: Item, lang: Lang) => item.name[lang];
const choose = (page: Page, value: string) => page.locator(`#skills-ctx-${value}`).check();

for (const lang of ["en", "da"] as const) {
  const path = lang === "en" ? "/" : "/da/";
  const label = LABELS[lang];

  test.describe(`Skills on ${path}`, () => {
    test("lists every evidenced skill in group order, and nothing without evidence", async ({ page }) => {
      await page.goto(path);
      const section = page.locator("section#skills");
      await expect(section.getByRole("heading", { level: 2 })).toHaveText(lang === "en" ? "Skills" : "Kompetencer");
      await expect(section.locator(".skill-group > h3")).toHaveText(groups.filter((group) => shown(group).length > 0).map((group) => group.group[lang]));
      await expect(section.locator(".headword")).toHaveText(items.map((item) => pickedName(item, lang)));
      for (const item of hidden) await expect(page.locator(`#skill-${item.id}`)).toHaveCount(0);
      await expect(section.locator("[data-todo]")).toHaveCount(0);
      await expect(section).not.toContainText("TODO");
      // Headings in order: h2, a group h3, then each skill as h4.
      await expect(section.locator("h4")).toHaveCount(items.length);
    });

    test("the filter names each context with its count", async ({ page }) => {
      await page.goto(path);
      const filter = page.getByRole("group", { name: label.legend });
      const options = [
        { value: "all", name: label.all, count: items.length },
        ...CONTEXTS.map((context) => ({ value: context, name: label[context], count: items.filter((item) => usedIn(item, context)).length })),
      ].filter((option) => option.count > 0);
      await expect(filter.getByRole("radio")).toHaveCount(options.length);
      for (const option of options) {
        // The count is part of the name, so a screen reader hears the result before choosing.
        // (sr-only commas are positioned boxes, so Chromium puts a space before each one.)
        await expect(filter.getByRole("radio", { name: new RegExp(`^${option.name} ?, ${option.count} ${label.unit}$`) })).toHaveCount(1);
      }
      await expect(page.locator("#skills-ctx-all")).toBeChecked();
    });

    test("each context, chosen with the keyboard, shows only what was used there, with its notes", async ({ page }) => {
      await page.goto(path);
      await page.locator("#skills-ctx-all").focus();
      for (const context of CONTEXTS) {
        const expected = items.filter((item) => usedIn(item, context));
        if (expected.length === 0) continue;
        await page.keyboard.press("ArrowRight");
        await expect(page.locator(`#skills-ctx-${context}`)).toBeChecked();
        await expect(page.locator("#skills .headword:visible")).toHaveText(expected.map((item) => pickedName(item, lang)));
        await expect(page.locator("#skills .skill-group:visible > h3")).toHaveText(
          groups.filter((group) => shown(group).some((item) => usedIn(item, context))).map((group) => group.group[lang]),
        );
        // Only senses of this context, and their notes are verbatim from content/.
        const contexts = await page.locator("#skills .sense:visible").evaluateAll((all) => all.map((sense) => sense.getAttribute("data-ctx")));
        expect(new Set(contexts)).toEqual(new Set([context]));
        const notes = expected.flatMap((item) => usages(item).filter((usage) => usage.context === context && usage.note).map((usage) => usage.note![lang]));
        await expect(page.locator("#skills .sense-note:visible")).toHaveText(notes);
        await expect(page.locator("#skills .sense-scope:visible")).toHaveCount(0);
      }
      // The arrow keys wrap back to All, which shows everything again.
      await page.keyboard.press("ArrowRight");
      await expect(page.locator("#skills-ctx-all")).toBeChecked();
      await expect(page.locator("#skills .headword:visible")).toHaveCount(items.length);
    });

    test("All is an index: places and qualifiers, no notes", async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("#skills .sense-evidence:visible")).toHaveCount(0);
      // Every qualifier stays next to its place, so no claim is shown without it.
      const scopes = [...new Set(items.flatMap((item) => usages(item).filter((usage) => usage.scope).map((usage) => usage.scope![lang])))];
      expect(scopes.length).toBeGreaterThan(0);
      for (const scope of scopes) await expect(page.locator("#skills .sense-scope:visible", { hasText: scope }).first()).toBeVisible();
      for (const item of items) {
        const withScope = usages(item).filter((usage) => usage.scope).length;
        if (withScope) await expect(page.locator(`#skill-${item.id} ~ .entry-body .sense-scope:visible`)).not.toHaveCount(0);
      }
    });
  });
}

test("every proof link lands, and a link to a closed project row opens it", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator("#skills a[href^='#']").evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  expect(hrefs.length).toBeGreaterThan(0);
  const missing = await page.evaluate((all) => all.filter((href) => !document.getElementById(href.slice(1))), hrefs);
  expect(missing).toEqual([]);
  // Every target is further down the page.
  const above = await page.evaluate(
    (all) => all.filter((href) => document.querySelector("#skills")!.compareDocumentPosition(document.getElementById(href.slice(1))!) & Node.DOCUMENT_POSITION_PRECEDING),
    hrefs,
  );
  expect(above).toEqual([]);

  // Study → Python → Tjekkit, a closed "More projects" row.
  await choose(page, "study");
  await page.locator("#skill-python ~ .entry-body a[href='#project-tjekkit']").click();
  await expect(page).toHaveURL(/#project-tjekkit$/);
  await expect(page.locator("details.more:has(> summary#project-tjekkit)")).toHaveAttribute("open", "");
  await expect(page.locator("#project-tjekkit")).toBeInViewport();

  // Back to the skill, then Internship → Power BI → the Experience entry.
  await page.goBack();
  await choose(page, "internship");
  await page.locator("#skill-power-bi ~ .entry-body a[href='#timeline-royal-unibrew-pmo']").first().click();
  await expect(page.locator("#timeline-royal-unibrew-pmo")).toBeInViewport();
});

test("a deep link to a skill shows its evidence in the index", async ({ page }) => {
  await page.goto("/#skill-prince2");
  await expect(page.locator("#skills-ctx-all")).toBeChecked();
  const prince2 = items.find((item) => item.id === "prince2")!;
  await expect(page.locator("#skill-prince2 ~ .entry-body .sense-note")).toHaveText(usages(prince2).map((usage) => usage.note!.en));
  // Other skills keep their notes folded away.
  await expect(page.locator("#skills .sense-note:visible")).toHaveCount(usages(prince2).length);
});

test("the chosen tile carries the section's one orange pillar; the others do not", async ({ page }) => {
  await page.goto("/");
  await choose(page, "internship");
  const pillar = (value: string) =>
    page.locator(`label[for=skills-ctx-${value}]`).evaluate((label) => {
      const style = getComputedStyle(label, "::before");
      return { color: style.backgroundColor, scale: style.scale };
    });
  await expect.poll(async () => (await pillar("internship")).scale).toBe("1");
  expect((await pillar("internship")).color).toBe("rgb(255, 79, 0)");
  await expect.poll(async () => (await pillar("all")).scale).toBe("1 0");
});

test("Skills fits 320px in every filter state, also at 200% text", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 800 } });
  const page = await context.newPage();
  await page.goto("/da/");
  for (const size of ["100%", "200%"]) {
    await page.evaluate((value) => (document.documentElement.style.fontSize = value), size);
    for (const value of ["all", ...CONTEXTS]) {
      if ((await page.locator(`#skills-ctx-${value}`).count()) === 0) continue;
      await choose(page, value);
      // The section itself: nothing in it is wider than the phone.
      const widths = await page.locator("section#skills").evaluate((section) => [section.scrollWidth, section.clientWidth]);
      expect(widths[0], `${size} ${value}`).toBeLessThanOrEqual(widths[1]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${size} ${value}`).toBeLessThanOrEqual(320);
    }
  }
  await context.close();
});

test("printing gives the whole dictionary, whatever the filter", async ({ page }) => {
  await page.goto("/");
  await choose(page, "freelance");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("#skills-filter")).toBeHidden();
  await expect(page.locator("#skills .headword:visible")).toHaveCount(items.length);
  await expect(page.locator("#skills .sense-note:visible")).toHaveCount(
    items.flatMap((item) => usages(item).filter((usage) => usage.note)).length,
  );
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`Skills has no axe violations in the index and in a report (${colorScheme})`, async ({ browser }) => {
    const context = await browser.newContext({ colorScheme });
    const page = await context.newPage();
    await page.goto("/");
    expect(await axe(page, "section#skills")).toEqual([]);
    await choose(page, "internship");
    expect(await axe(page, "section#skills")).toEqual([]);
    await context.close();
  });
}

test("screen readers hear each register line with pauses", async ({ page }) => {
  await page.goto("/");
  const line = await page.locator("#skill-python ~ .entry-body .sense").filter({ hasText: "Tjekkit" }).ariaSnapshot();
  expect(line).toMatch(/Study ?: Tjekkit ?, 2023 ?, Group project \(not finished\)/);
});
