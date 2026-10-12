import { readdirSync, readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { load } from "js-yaml";
import {
  axe,
  expectClearOfHeader,
  frontmatter,
  isTodo,
  LANDED,
  landingBars,
  setDefaultFontSize,
  waitForScrollEnd,
} from "./helpers";

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
  gloss?: Localized;
  certifications?: string[];
}
interface Group {
  id: string;
  group: Localized;
  order: number;
  items: Item[];
}
interface Project {
  title: Localized;
  timeline?: string;
  featured?: boolean;
  draft?: boolean;
  order: number;
}
interface Entry {
  title: Localized;
  summary: Localized;
  organization: string;
  kind: string;
  draft?: boolean;
}
interface Certification {
  id: string;
  name: string | Localized;
}

// The skills, read from content/skills the way Skills.astro reads them: an item shows when it
// has evidence (usedIn is a list, with at least one register line) and is not awaiting the
// owner's confirmation.
const groups: Group[] = readdirSync("content/skills")
  .filter((file) => file.endsWith(".yaml") && !file.startsWith("_"))
  .map((file) => ({ id: file.replace(/\.yaml$/, ""), ...(load(readFileSync(`content/skills/${file}`, "utf8")) as Omit<Group, "id">) }))
  .sort((a, b) => a.order - b.order);
const known = (field: Localized) => !isTodo(field.en) || !isTodo(field.da);

// What Skills links to: the projects and Experience entries the site renders.
const read = <T>(dir: string) =>
  readdirSync(`content/${dir}`)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .map((file) => [file.replace(/\.md$/, ""), load(frontmatter(readFileSync(`content/${dir}/${file}`, "utf8"))) as T] as const);
const projects = new Map(read<Project>("projects").filter(([, project]) => !project.draft && known(project.title)));
const timeline = new Map(
  read<Entry>("timeline").filter(([, entry]) => !entry.draft && !isTodo(entry.kind) && known(entry.title) && known(entry.summary)),
);
const certifications = load(readFileSync("content/certifications.yaml", "utf8")) as Certification[];

// As Skills.astro uses them: a note (and its scope) only when one language is not a TODO, and
// never a usage whose only proof is a hidden project (a draft).
const usages = (item: Item) =>
  (item.usedIn as Usage[])
    .filter((usage) => !usage.project || projects.has(usage.project) || (usage.timeline !== undefined && timeline.has(usage.timeline)))
    .map((usage) =>
      usage.note && known(usage.note)
        ? { ...usage, scope: usage.scope && known(usage.scope) ? usage.scope : undefined }
        : { ...usage, note: undefined, scope: undefined },
    );
const CONTEXTS = ["internship", "work", "freelance", "study", "personal"] as const;
const rank = (context: string) => (CONTEXTS as readonly string[]).indexOf(context);
const shown = (group: Group) => group.items.filter((item) => !item.confirm && Array.isArray(item.usedIn) && lines(item).length > 0);
const items = groups.flatMap(shown);
const hidden = groups.flatMap((group) => group.items).filter((item) => !items.includes(item));
const usedIn = (item: Item, context: string) => usages(item).some((usage) => usage.context === context);
// The contexts with a report, i.e. a tile in the filter after All.
const REPORTS = CONTEXTS.filter((context) => items.some((item) => usedIn(item, context)));

const LABELS = {
  en: {
    legend: "Show skills used in",
    all: "All",
    unit: "skills",
    internship: "Internship",
    work: "Work",
    freelance: "Freelance",
    study: "Study",
    personal: "Personal",
    also: "Also used in",
    certificates: "Certificates",
    project: "Project",
    experience: "Experience",
    education: "Education",
  },
  da: {
    legend: "Vis kompetencer brugt i",
    all: "Alle",
    unit: "kompetencer",
    internship: "Praktik",
    work: "Arbejde",
    freelance: "Freelance",
    study: "Studie",
    personal: "Personligt",
    also: "Også brugt i",
    certificates: "Certifikater",
    project: "Projekt",
    experience: "Erfaring",
    education: "Uddannelse",
  },
} as const;

/** A field in `lang`, or in the other language while this one is a TODO (as the site picks it). */
const pick = (field: Localized, lang: Lang) => (isTodo(field[lang]) ? field[lang === "en" ? "da" : "en"] : field[lang]);
const pickedName = (item: Item, lang: Lang) => item.name[lang];
const choose = (page: Page, value: string) => page.locator(`#skills-ctx-${value}`).check();
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

interface Line {
  context: string;
  first: number;
  /** The place's link: the employer for a job, else the project, else the Experience entry. */
  place?: string;
  usages: Usage[];
  /** Every proof the line links to, the place first. */
  links: string[];
}

/**
 * An entry's register lines from content/: one per context and place (a job is told by its
 * employer, which a project's timeline names), paid work first, then in content/ order.
 */
function lines(item: Item): Line[] {
  const byKey = new Map<string, Line>();
  usages(item).forEach((usage, index) => {
    const project = usage.project && projects.has(usage.project) ? usage.project : undefined;
    const own = usage.timeline && timeline.has(usage.timeline) ? usage.timeline : undefined;
    const employer = ["internship", "work"].includes(usage.context)
      ? [usage.timeline, project && projects.get(project)!.timeline].find((id) => id && timeline.has(id))
      : undefined;
    const place = employer ? `#timeline-${employer}` : project ? `#project-${project}` : own ? `#timeline-${own}` : undefined;
    const key = `${usage.context} ${place ?? index}`;
    const line = byKey.get(key) ?? { context: usage.context, first: index, place, usages: [], links: place ? [place] : [] };
    byKey.set(key, line);
    line.usages.push(usage);
    for (const link of [project && `#project-${project}`, employer && `#timeline-${employer}`, own && `#timeline-${own}`]) {
      if (link && !line.links.includes(link)) line.links.push(link);
    }
  });
  return [...byKey.values()]
    .filter((line) => line.links.length > 0 || line.usages.some((usage) => usage.note))
    .sort((a, b) => rank(a.context) - rank(b.context) || a.first - b.first);
}

/** An entry's notes in the order the register shows them, optionally for one context. */
const notes = (item: Item, lang: Lang, context?: string) =>
  lines(item)
    .filter((line) => !context || line.context === context)
    .flatMap((line) => line.usages.filter((usage) => usage.note).map((usage) => pick(usage.note!, lang)));

/** A line's qualifiers, once each, from usages that have a note to carry them. */
const scopes = (line: Line, lang: Lang) => [
  ...new Set(line.usages.filter((usage) => usage.note && usage.scope).map((usage) => pick(usage.scope!, lang))),
];

/**
 * The gloss under a headword in the index: the skill's own gloss, else the first note, in register order, that says more
 * than the term or its own qualifier. The qualifier is cut off only when the entry has one
 * line, which still shows it beside the gloss.
 */
function glossOf(item: Item, lang: Lang): string | undefined {
  // The skill's own gloss (the facts text for all its places) comes first.
  if (item.gloss && known(item.gloss)) return pick(item.gloss, lang);
  const all = lines(item);
  const term = pick(item.name, lang).split(" (")[0].toLowerCase();
  for (const usage of all.flatMap((line) => line.usages).filter((usage) => usage.note)) {
    const note = pick(usage.note!, lang);
    const scope = usage.scope && pick(usage.scope, lang);
    if (note === scope) continue; // a note that is only its qualifier says nothing more
    const prefix = scope && all.length === 1 ? [`${scope}: `, `${scope}; `].find((start) => note.startsWith(start)) : undefined;
    const value = prefix ? note.slice(prefix.length) : note;
    const gloss = value.charAt(0).toLocaleUpperCase(lang) + value.slice(1);
    if (!gloss.toLowerCase().startsWith(term)) return gloss;
  }
  return undefined;
}

/** What a link names: a project by its short title, an Experience entry by its employer or school. */
function described(href: string, lang: Lang) {
  const [, kind, id] = href.match(/^#(project|timeline)-(.+)$/)!;
  if (kind === "project") {
    const title = pick(projects.get(id)!.title, lang).split(": ")[0];
    return { place: title, kind: LABELS[lang].project, title };
  }
  const entry = timeline.get(id)!;
  return {
    place: entry.organization.split(" – ")[0],
    kind: entry.kind === "education" ? LABELS[lang].education : LABELS[lang].experience,
    title: pick(entry.title, lang),
  };
}

/** The certificates line of a skill: names from content/certifications.yaml, localized, without TODOs. */
const certNames = (item: Item, lang: Lang) =>
  (item.certifications ?? [])
    .flatMap((id) => certifications.filter((certification) => certification.id === id))
    .map(({ name }) => (typeof name === "string" ? name : name[lang]))
    .filter((name) => !isTodo(name));

const entryOf = (page: Page, id: string) => page.locator(`.entry:has(> .entry-head > #skill-${id})`);

for (const lang of ["en", "da"] as const) {
  const path = lang === "en" ? "/" : "/da/";
  const label = LABELS[lang];
  const glossed = items.filter((item) => glossOf(item, lang));

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
        ...REPORTS.map((context) => ({ value: context, name: label[context], count: items.filter((item) => usedIn(item, context)).length })),
      ];
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
      for (const context of REPORTS) {
        const expected = items.filter((item) => usedIn(item, context));
        await page.keyboard.press("ArrowRight");
        await expect(page.locator(`#skills-ctx-${context}`)).toBeChecked();
        await expect(page.locator("#skills .headword:visible")).toHaveText(expected.map((item) => pickedName(item, lang)));
        await expect(page.locator("#skills .skill-group:visible > h3")).toHaveText(
          groups.filter((group) => shown(group).some((item) => usedIn(item, context))).map((group) => group.group[lang]),
        );
        // Only the lines of this context, and their notes verbatim from content/, in register order.
        await expect(page.locator("#skills .sense:visible")).toHaveCount(
          expected.flatMap((item) => lines(item).filter((line) => line.context === context)).length,
        );
        await expect(page.locator(`#skills .sense:visible:not([data-ctx="${context}"])`)).toHaveCount(0);
        await expect(page.locator("#skills .sense-note:visible")).toHaveText(expected.flatMap((item) => notes(item, lang, context)));
        await expect(page.locator("#skills .sense-scope:visible")).toHaveCount(0);
        // A report shows the full notes, not the glosses.
        await expect(page.locator("#skills .entry-gloss:visible")).toHaveCount(0);
      }
      // The arrow keys wrap back to All, which shows everything again.
      await page.keyboard.press("ArrowRight");
      await expect(page.locator("#skills-ctx-all")).toBeChecked();
      await expect(page.locator("#skills .headword:visible")).toHaveCount(items.length);
    });

    test("All is an index: a gloss per skill, places and qualifiers, no full notes", async ({ page }) => {
      await page.goto(path);
      // Some line has a qualifier, so the qualifier checks below test something.
      expect(items.flatMap((item) => lines(item).flatMap((line) => scopes(line, lang))).length).toBeGreaterThan(0);
      await expect(page.locator("#skills .sense-evidence:visible")).toHaveCount(0);
      // Places are named, not linked, in the index.
      await expect(page.locator("#skills .place-link:visible")).toHaveCount(0);
      for (const item of items) {
        const entry = entryOf(page, item.id);
        // One register line per context and place, paid work first, whatever order content/ lists them in.
        const senses = await entry.locator(".sense").evaluateAll((all) =>
          all.map((sense) => `${sense.getAttribute("data-ctx")} ${sense.querySelector(".place-link")?.getAttribute("href") ?? "-"}`),
        );
        expect(senses, item.id).toEqual(lines(item).map((line) => `${line.context} ${line.place ?? "-"}`));
        // Every qualifier stays next to its place, so no claim is shown without it.
        await expect(entry.locator(".sense-scope:visible"), item.id).toHaveText(
          lines(item).flatMap((line) => scopes(line, lang)).map((scope) => new RegExp(`·\\s*${escape(scope)}$`)),
        );
        // The gloss is the first telling note, verbatim, at most without its qualifier.
        const gloss = entry.locator(".entry-gloss");
        const expected = glossOf(item, lang);
        if (expected) await expect(gloss, item.id).toHaveText(expected);
        else await expect(gloss, item.id).toHaveCount(0);
      }
      await expect(page.locator("#skills .entry-gloss:visible")).toHaveCount(glossed.length);
    });

    test("a report names the other contexts a skill was used in, never its own; All names none", async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("#skills .entry-also:visible")).toHaveCount(0);
      // Some skill is used in more than one context, so the line is tested at all.
      expect(items.some((item) => REPORTS.filter((context) => usedIn(item, context)).length > 1)).toBe(true);
      for (const context of REPORTS) {
        await choose(page, context);
        const expected = items.filter((item) => usedIn(item, context));
        const others = (item: Item) => REPORTS.filter((other) => other !== context && usedIn(item, other));
        await expect(page.locator("#skills .entry-also:visible")).toHaveCount(expected.filter((item) => others(item).length > 0).length);
        for (const item of expected.filter((candidate) => others(candidate).length > 0)) {
          const also = entryOf(page, item.id).locator(".entry-also:visible");
          await expect(also).toContainText(`${label.also}:`);
          await expect(also.locator(".also-ctx")).toHaveText(others(item).map((other) => label[other]));
        }
      }
      await choose(page, "all");
      await expect(page.locator("#skills .entry-also:visible")).toHaveCount(0);
    });

    test("each report links every place and proof from content/, named with what it leads to", async ({ page }) => {
      await page.goto(path);
      for (const context of REPORTS) {
        await choose(page, context);
        for (const item of items.filter((candidate) => usedIn(candidate, context))) {
          // Each line: its place as the link, then its further proofs.
          const got = await entryOf(page, item.id)
            .locator(".sense:visible")
            .evaluateAll((all) =>
              all.map((sense) => [...sense.querySelectorAll(".place-link, .proof-link")].map((link) => link.getAttribute("href"))),
            );
          expect(got, `${context} → ${item.id}`).toEqual(lines(item).filter((line) => line.context === context).map((line) => line.links));
        }
        // The place is named "<place>, <what it leads to>", a proof "<what it is>: <title>";
        // the arrow is shown but not read.
        const links = page.locator("#skills :is(.place-link, .proof-link):visible");
        await expect(links).toHaveCount(
          items.flatMap((item) => lines(item).filter((line) => line.context === context)).flatMap((line) => line.links).length,
        );
        for (const link of await links.all()) {
          const target = described((await link.getAttribute("href"))!, lang);
          const isPlace = await link.evaluate((element) => element.classList.contains("place-link"));
          await expect(link).toHaveAccessibleName(
            isPlace
              ? new RegExp(`^${escape(target.place)}\\s*,\\s*${escape(target.kind)}$`)
              : new RegExp(`^${escape(target.kind)}\\s*:\\s*${escape(target.title)}$`),
          );
          await expect(link.locator('[aria-hidden="true"]')).toHaveText("↓");
        }
      }
    });

    test("each certificates line lists exactly the skill's certifications from content/, visible in the index", async ({ page }) => {
      await page.goto(path);
      const withCerts = items.filter((item) => certNames(item, lang).length > 0);
      expect(withCerts.length).toBeGreaterThan(0);
      // No skill without certifications gets a line.
      await expect(page.locator("#skills .entry-certs")).toHaveCount(withCerts.length);
      for (const item of withCerts) {
        const line = entryOf(page, item.id).locator(".entry-certs");
        await expect(line).toBeVisible();
        await expect(line.locator(".certs-label")).toHaveText(new RegExp(`^${label.certificates}\\s*:$`));
        await expect(line.locator(".cert-name")).toHaveText(certNames(item, lang));
      }
    });

    for (const id of ["prince2", "python"]) {
      test(`a deep link to a skill shows its evidence, links its places and marks it (${id})`, async ({ page }) => {
        const item = items.find((candidate) => candidate.id === id)!;
        await page.goto(`${path}#skill-${id}`);
        await expect(page.locator("#skills-ctx-all")).toBeChecked();
        const entry = entryOf(page, id);
        // Its notes, verbatim and paid work first; the other skills keep theirs folded away.
        await expect(entry.locator(".sense-note:visible")).toHaveText(notes(item, lang));
        await expect(page.locator("#skills .sense-note:visible")).toHaveCount(notes(item, lang).length);
        // Its places become links; the other skills keep naming theirs.
        const places = lines(item).filter((line) => line.place).length;
        await expect(entry.locator(".place-link:visible")).toHaveCount(places);
        await expect(entry.locator(".place-index:visible")).toHaveCount(0);
        await expect(page.locator("#skills .place-link:visible")).toHaveCount(places);
        // Its qualifiers are in the full notes now, so the register lines drop them. Python has
        // one (Tjekkit), so this rule is tested for real.
        if (id === "python") expect(lines(item).flatMap((line) => scopes(line, lang)).length).toBeGreaterThan(0);
        await expect(entry.locator(".sense-scope")).toHaveCount(lines(item).flatMap((line) => scopes(line, lang)).length);
        await expect(entry.locator(".sense-scope:visible")).toHaveCount(0);
        // Its gloss gives way to the notes (it is there, so hidden is not just missing); the others keep theirs.
        expect(glossOf(item, lang)).toBeDefined();
        await expect(entry.locator(".entry-gloss")).toHaveCount(1);
        await expect(entry.locator(".entry-gloss")).toBeHidden();
        await expect(page.locator("#skills .entry-gloss:visible")).toHaveCount(glossed.length - 1);
        // The entry it lands on carries the ink bar, and no other.
        expect(await landingBars(page)).toEqual([[`skill-${id}`, ...LANDED]]);
      });
    }

    test("without :has(), the filter is hidden and the whole dictionary shows with all its evidence", async ({ page }) => {
      // Chromium has :has(), so rename it in the built CSS. That drops the @supports block and
      // every :has() rule, as a browser without :has() would.
      await page.route("**/_astro/*.css", async (route) => {
        const response = await route.fetch();
        await route.fulfill({ response, body: (await response.text()).replaceAll(":has(", ":no-has(") });
      });
      await page.goto(path);
      // The rename reached every stylesheet; none was inlined where the route cannot see it.
      const left = await page.evaluate(
        () => [...document.styleSheets].flatMap((sheet) => [...sheet.cssRules]).filter((rule) => rule.cssText.includes(":has(")).length,
      );
      expect(left).toBe(0);
      // No filter that does nothing, and no link back to it.
      await expect(page.locator("#skills-filter")).toBeHidden();
      await expect(page.locator("#skills .to-filter")).toBeHidden();
      // Every entry and line, with the full notes and the places linked to their proof.
      const all = items.flatMap(lines);
      await expect(page.locator("#skills .headword:visible")).toHaveCount(items.length);
      await expect(page.locator("#skills .sense:visible")).toHaveCount(all.length);
      await expect(page.locator("#skills .sense-note:visible")).toHaveCount(items.flatMap((item) => notes(item, lang)).length);
      await expect(page.locator("#skills .sense-evidence:visible")).toHaveCount(
        all.filter((line) => line.usages.some((usage) => usage.note) || line.links.length > (line.place ? 1 : 0)).length,
      );
      await expect(page.locator("#skills .place-link:visible")).toHaveCount(all.filter((line) => line.place).length);
      // None of the index or report extras.
      for (const selector of [".place-index", ".entry-gloss", ".sense-scope", ".entry-also"]) {
        await expect(page.locator(`#skills ${selector}:visible`), selector).toHaveCount(0);
      }
    });

    // Each print rule only shows in the state whose screen rules differ: glosses and qualifiers
    // show only in All; place links, "Also used in" and a note-less line of another context only
    // in a report.
    for (const value of ["all", "study"]) {
      test(`printing gives the whole dictionary, from ${value}`, async ({ page }) => {
        await page.goto(path);
        await choose(page, value);
        await page.emulateMedia({ media: "print" });
        const all = items.flatMap(lines);
        await expect(page.locator("#skills-filter")).toBeHidden();
        await expect(page.locator("#skills .headword:visible")).toHaveCount(items.length);
        await expect(page.locator("#skills .sense:visible")).toHaveCount(all.length);
        await expect(page.locator("#skills .sense-note:visible")).toHaveCount(items.flatMap((item) => notes(item, lang)).length);
        // Places are named as text on paper, never as screen links.
        await expect(page.locator("#skills .place-index:visible")).toHaveCount(all.filter((line) => line.place).length);
        for (const selector of [".place-link", ".entry-gloss", ".entry-also", ".to-filter", ".sense-scope"]) {
          await expect(page.locator(`#skills ${selector}:visible`), selector).toHaveCount(0);
        }
      });
    }
  });
}

test("every link in Skills has its target further down the page, except the one back to the filter", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator("#skills a[href^='#']").evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  // Exactly the proofs content/ names, and the way back to the filter.
  expect([...new Set(hrefs)].sort()).toEqual([...new Set([...items.flatMap(lines).flatMap((line) => line.links), "#skills-filter"])].sort());
  const missing = await page.evaluate((all) => all.filter((href) => !document.getElementById(href.slice(1))), hrefs);
  expect(missing).toEqual([]);
  // Compared with the link itself, not with the section: a target above its link reads as a wrong turn.
  const up = await page.locator("#skills a[href^='#']").evaluateAll((links) =>
    links
      .filter((link) => link.compareDocumentPosition(document.getElementById(link.getAttribute("href")!.slice(1))!) & Node.DOCUMENT_POSITION_PRECEDING)
      .map((link) => link.getAttribute("href")),
  );
  expect(up).toEqual(["#skills-filter"]);
});

test("a second click on the same link reopens a row the reader closed", async ({ page }) => {
  // The reader is already on #project-tjekkit, closes the row and clicks the same link again. The
  // hash does not change, so no hashchange fires: only the click listener in Projects.astro can open the row.
  await page.goto("/#project-tjekkit");
  const row = page.locator("details.more:has(> summary#project-tjekkit)");
  await expect(row).toHaveAttribute("open", "");
  await row.locator("summary").click();
  await expect(row).not.toHaveAttribute("open", "");
  await page.evaluate(() => addEventListener("hashchange", () => (document.body.dataset.hashchange = "fired")));
  await choose(page, "study");
  await entryOf(page, "python").locator("a.place-link[href='#project-tjekkit']").click();
  await expect(page).toHaveURL(/#project-tjekkit$/);
  await expectClearOfHeader(page.locator("#project-tjekkit"));
  await expect(row).toHaveAttribute("open", "");
  await expect(page.locator("body")).not.toHaveAttribute("data-hashchange");
});

const SIGNAL = { light: "rgb(255, 79, 0)", dark: "rgb(255, 106, 43)" } as const; // --signal in global.css
for (const colorScheme of ["light", "dark"] as const) {
  test(`the chosen tile carries the section's one orange pillar; the others do not (${colorScheme})`, async ({ browser }) => {
    const context = await browser.newContext({ colorScheme });
    const page = await context.newPage();
    await page.goto("/");
    const pillars = () =>
      page.locator("#skills .ctx-label").evaluateAll((labels) =>
        labels.map((label) => `${(label as HTMLLabelElement).htmlFor}:${getComputedStyle(label, "::before").scale}`),
      );
    const only = (chosen: string) => ["all", ...REPORTS].map((value) => `skills-ctx-${value}:${value === chosen ? "1" : "1 0"}`);
    await choose(page, "internship");
    await expect.poll(pillars).toEqual(only("internship"));
    const color = await page.locator("label[for=skills-ctx-internship]").evaluate((label) => getComputedStyle(label, "::before").backgroundColor);
    expect(color).toBe(SIGNAL[colorScheme]);
    // The old pillar leaves at once: read it in the same task as the switch, before any transition could run.
    const old = await page.evaluate(() => {
      document.querySelector<HTMLInputElement>("#skills-ctx-study")!.click();
      return getComputedStyle(document.querySelector("label[for=skills-ctx-internship]")!, "::before").scale;
    });
    expect(old).toBe("1 0");
    await expect.poll(pillars).toEqual(only("study"));
    await context.close();
  });
}

test("Skills fits 320px in every filter state, also at 200% text", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const size of [16, 32]) {
    // 200% as the browser's default font size, so rem in media and container queries scales too.
    await setDefaultFontSize(page, size);
    await page.goto("/da/");
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe(`${size}px`);
    for (const value of ["all", ...REPORTS]) {
      await choose(page, value);
      // The section itself: nothing in it is wider than the phone.
      const widths = await page.locator("section#skills").evaluate((section) => [section.scrollWidth, section.clientWidth]);
      expect(widths[0], `${size} ${value}`).toBeLessThanOrEqual(widths[1]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${size} ${value}`).toBeLessThanOrEqual(320);
    }
  }
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
  const line = await page.locator(".entry:has(#skill-python) .entry-body .sense").filter({ hasText: "Tjekkit" }).ariaSnapshot();
  expect(line).toMatch(/Study\s*:\s*Tjekkit\s*,\s*2023\s*,\s*Group project \(not finished\)/);
});

test("glosses keep a group project's qualifier unless the register line beside them shows it", async ({ page }) => {
  await page.goto("/");
  const gloss = (id: string) => page.locator(`.entry:has(#skill-${id}) .entry-gloss`);
  // One sense: the line beside it says "Tjekkit · 2023 · Group project", so the gloss can drop it.
  await expect(gloss("prototyping")).toHaveText("I made the wireframes and the prototype");
  // Several senses: the note stays whole, so the group work never reads as the whole entry's.
  await expect(gloss("uml-system-modeling")).toHaveText(/^Group project: /);
  await expect(gloss("html-css-javascript")).toHaveText(/^HTML and CSS; /);
  // A note that is only its qualifier gives no gloss.
  await expect(gloss("enterprise-architecture")).toHaveCount(0);
});

// Where a visitor lands, on a phone and on a desktop, with the default text size and with the
// browser's default font at 150% (rem in media and container queries follows it, and the
// header can wrap). Smooth scrolling is on, as for most visitors.
const ordered = [...projects].sort(([, a], [, b]) => a.order - b.order);
const firstFeatured = ordered.find(([, project]) => project.featured)![0];
const firstRow = ordered.find(([, project]) => !project.featured)![0];
// Whether a link's target is a closed "More projects" row, and which line must stay in view
// above it, comes from content/: a featured project keeps its "01 · year · context" line, an
// Experience entry its period (on phones it sits above the heading).
const landing = (href: string) => {
  const project = href.startsWith("#project-") ? projects.get(href.slice("#project-".length)) : undefined;
  return {
    row: project !== undefined && !project.featured,
    above: project?.featured
      ? `.featured:has(${href}) .project-meta`
      : href.startsWith("#timeline-")
        ? `.timeline-entry:has(${href}) .timeline-meta`
        : undefined,
  };
};
const CLICKS = [
  { context: "study", link: ".entry:has(#skill-python) a.place-link[href='#project-tjekkit']" },
  { context: "freelance", link: "a.place-link[href='#project-24support-christmas-calendar']" },
  { context: "internship", link: ".entry:has(#skill-power-bi) a.proof-link[href='#project-royal-unibrew-projectflow-power-bi']" },
  { context: "internship", link: ".entry:has(#skill-power-bi) a.place-link[href='#timeline-royal-unibrew-pmo']" },
  // Back up to the filter, which has no landing bar.
  { context: "internship", link: "a.to-filter" },
];
const DEEP = [
  { hash: "#skill-prince2" },
  { hash: `#project-${firstRow}`, row: true },
  { hash: `#project-${firstFeatured}`, above: `.featured:has(#project-${firstFeatured}) .project-meta` },
  { hash: "#timeline-royal-unibrew-pmo", above: ".timeline-entry:has(#timeline-royal-unibrew-pmo) .timeline-meta" },
];

for (const width of [375, 1440]) {
  for (const font of [16, 24]) {
    test.describe(`Landing at ${width}px with ${font}px text`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await setDefaultFontSize(page, font);
      });

      test("each kind of link in a Skills report lands clear of the sticky header, on the entry it names", async ({ page }) => {
        await page.goto("/");
        for (const { context, link } of CLICKS) {
          await choose(page, context);
          const anchor = page.locator(`#skills ${link}:visible`).first();
          const href = (await anchor.getAttribute("href"))!;
          const { row, above } = landing(href);
          await anchor.click();
          await expect(page).toHaveURL(new RegExp(`${href}$`));
          if (row) await expect(page.locator(`details:has(> summary${href})`)).toHaveAttribute("open", "");
          await expectClearOfHeader(page.locator(href), above ? page.locator(above) : undefined);
          // The entry it names carries the ink bar, and no other.
          expect(await landingBars(page), href).toEqual(href === "#skills-filter" ? [] : [[href.slice(1), ...LANDED]]);
        }
      });

      test("deep links and nav jumps land clear of the sticky header", async ({ page }) => {
        for (const path of ["/", "/da/"]) {
          for (const { hash, above, row } of DEEP) {
            // about:blank first, so each one loads a new page, as a link from the CV would.
            await page.goto("about:blank");
            await page.goto(`${path}${hash}`);
            if (row) await expect(page.locator(`details:has(> summary${hash})`)).toHaveAttribute("open", "");
            await expectClearOfHeader(page.locator(hash), above ? page.locator(above) : undefined);
            expect(await landingBars(page), hash).toEqual([[hash.slice(1), ...LANDED]]);
          }
          // A nav jump lays the section's rule on the header's rule: one hairline, not two.
          for (const id of ["skills", "projects", "experience"]) {
            await page.locator(`body > header nav a[href="#${id}"]`).click();
            await waitForScrollEnd(page);
            const gap = await page.evaluate(
              (id) => document.getElementById(id)!.getBoundingClientRect().top - document.querySelector("body > header")!.getBoundingClientRect().bottom,
              id,
            );
            expect(gap, `${path}#${id}`).toBeGreaterThanOrEqual(-2);
            expect(gap, `${path}#${id}`).toBeLessThanOrEqual(0);
          }
        }
      });
    });
  }
}
