import { readdirSync, readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { load } from "js-yaml";
import { expectClearOfHeader, LANDED, landingBars } from "./helpers";

type Localized = Record<"en" | "da", string>;
interface Project {
  id: string;
  title: Localized;
  role: Localized;
  result: Localized;
  method: Localized;
  keyline?: Localized;
  technology?: string[];
  featured?: boolean;
  draft?: boolean;
  order: number;
}

// The published projects, read from content/projects the way the site reads them.
const projects: Project[] = readdirSync("content/projects")
  .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
  .map((file) => {
    const frontmatter = readFileSync(`content/projects/${file}`, "utf8").split(/^---$/m)[1];
    return { id: file.replace(/\.md$/, ""), ...(load(frontmatter) as Omit<Project, "id">) };
  })
  .filter((project) => !project.draft)
  .sort((a, b) => a.order - b.order);

const featured = projects.filter((project) => project.featured);
const more = projects.filter((project) => !project.featured);
const isTodo = (value: string) => value.trimStart().startsWith("TODO:");
const row = (page: Page, id: string) => page.locator(`details.more:has(> summary#project-${id})`);

for (const lang of ["en", "da"] as const) {
  const path = lang === "en" ? "/" : "/da/";

  test.describe(`Projects on ${path}`, () => {
    test("lists every published project, featured first, with no TODO showing", async ({ page }) => {
      await page.goto(path);
      const section = page.locator("section#projects");
      await expect(section.getByRole("heading", { level: 2 })).toHaveText(lang === "en" ? "Projects" : "Projekter");
      await expect(section.locator("article.featured h3")).toHaveText(featured.map((project) => project.title[lang]));
      await expect(section.locator("details.more summary .more-title")).toHaveText(more.map((project) => project.title[lang]));
      await expect(section.locator("[data-todo]:visible")).toHaveCount(0);
      await expect(section).not.toContainText("TODO");
    });

    test("the Business ⇄ Tech switch changes the view with the keyboard", async ({ page }) => {
      await page.goto(path);
      const first = page.locator("article.featured").first();
      const project = featured[0];
      await expect(first.locator(".view-business")).toBeVisible();
      await expect(first.locator(".view-tech")).toBeHidden();
      if (!isTodo(project.result[lang])) await expect(first.locator(".result dd")).toHaveText(project.result[lang]);

      const lens = page.getByRole("group", { name: lang === "en" ? "Show projects as" : "Vis projekterne som" });
      await expect(lens.getByRole("radio")).toHaveCount(2);
      // The chosen side is at full contrast: ink on paper, then paper on ink.
      const color = (selector: string, property = "color") =>
        page.locator(selector).first().evaluate((element, name) => getComputedStyle(element).getPropertyValue(name), property);
      await expect.poll(() => color(".lens-business")).toBe("rgb(17, 17, 17)");

      await page.locator("#projects-lens-business").focus();
      await page.keyboard.press("ArrowRight");
      await expect(page.locator("#projects-lens-tech")).toBeChecked();
      // Colours ease for 150 ms, so wait for the end state: Tech at full contrast,
      // Business back to steel.
      await expect.poll(() => color(".lens-tech")).toBe("rgb(243, 240, 232)");
      await expect.poll(() => color(".lens-business")).toBe("rgb(104, 108, 115)");
      await expect(first.locator(".view-business")).toBeHidden();
      await expect(first.locator(".view-tech")).toBeVisible();
      if (!isTodo(project.method[lang])) await expect(first.locator(".view-tech dd").first()).toHaveText(project.method[lang]);
      // Featured entries show their tools under the title, so the Tech view holds the method only.
      await expect(first.locator(".view-tech dt")).toHaveText([lang === "en" ? "Method" : "Metode"]);
      await expect(first.locator(".view-tech .chips")).toHaveCount(0);
      // Panel style: the hero's ink panel.
      await expect.poll(() => color("article.featured .view-tech", "background-color")).toBe("rgb(17, 17, 17)");
    });

    test("each featured project shows its keyline and tools in the default view", async ({ page }) => {
      await page.goto(path);
      const articles = page.locator("article.featured");
      for (const [index, project] of featured.entries()) {
        const article = articles.nth(index);
        const keyline = project.keyline?.[lang];
        expect(keyline, `${project.id} has a keyline`).toBeTruthy();
        // Selection only: the keyline is a verbatim part of the result or the role.
        expect(project.result[lang].includes(keyline!) || project.role[lang].includes(keyline!)).toBe(true);
        await expect(article.locator(".keyline")).toHaveText(keyline!);
        const tools = (project.technology ?? []).filter((item) => !isTodo(item));
        await expect(article.locator(".featured-head .chips li")).toHaveText(tools);
        await expect(article.locator(".featured-head .chips")).toBeVisible();
      }
    });

    test("a project in the list opens with the keyboard", async ({ page }) => {
      await page.goto(path);
      const row = page.locator("details.more").first();
      await expect(row.locator(".more-body")).toBeHidden();
      await row.locator("summary").focus();
      await page.keyboard.press("Enter");
      await expect(row).toHaveAttribute("open", "");
      await expect(row.locator(".view-business")).toBeVisible();
    });
  });
}

test("the planned projects lead, and their links work", async ({ page }) => {
  // Work, then code with a live demo, then study.
  expect(featured.map((project) => project.id)).toEqual([
    "royal-unibrew-projectflow-power-bi",
    "24support-christmas-calendar",
    "royal-unibrew-hybrid-pmo-bachelor-project",
  ]);
  await page.goto("/");
  const section = page.locator("section#projects");
  const demo = section.getByRole("link", { name: "Open calendar demo" });
  await expect(demo).toHaveAttribute("href", "/freelance/24support-julekalender/index.html");
  await expect(demo).toHaveClass(/\bcta\b/);
  expect((await page.request.get("/freelance/24support-julekalender/index.html")).ok()).toBe(true);
  await expect(section.locator('a[href="https://ss.ssrengoringsservice.dk/"]')).toHaveAttribute("rel", "noopener");
  await expect(section.locator('a[href="/budget-skabelon.xlsx"]')).toHaveAttribute("download", "");
  expect((await page.request.get("/budget-skabelon.xlsx")).ok()).toBe(true);
});

test("every project has one anchor, and a later jump to a list row opens it and moves the bar", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section#projects");
  for (const project of projects) await expect(section.locator(`#project-${project.id}`)).toHaveCount(1);
  for (const project of featured) await expect(section.locator(`h3#project-${project.id}`)).toHaveAttribute("tabindex", "-1");

  // A jump within the page (the hashchange path) opens the row, and the bar moves with it.
  const [first, second] = more;
  for (const { id } of [first, second]) {
    await page.evaluate((hash) => (location.hash = hash), `project-${id}`);
    await expect(row(page, id)).toHaveAttribute("open", "");
    await expectClearOfHeader(page.locator(`#project-${id}`));
    await expect.poll(() => landingBars(page)).toEqual([[`project-${id}`, ...LANDED]]);
  }
});

for (const width of [375, 1280]) {
  test(`a deep link to any project opens it on load and lands on it, marked, below the header (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    // Instant scrolling, as this is about where each one lands; the Skills landing tests scroll smoothly.
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const project of projects) {
      // about:blank first, so Playwright loads a new document, as a link from the CV would,
      // instead of jumping within this one (which would only fire hashchange).
      await page.goto("about:blank");
      await page.goto(`/#project-${project.id}`);
      const target = page.locator(`#project-${project.id}`);
      if (project.featured) {
        // A featured project keeps its "01 · year · context" line in view.
        await expectClearOfHeader(target, page.locator(`article.featured:has(#project-${project.id}) .project-meta`));
      } else {
        await expect(row(page, project.id)).toHaveAttribute("open", "");
        await expectClearOfHeader(target);
      }
      expect(await landingBars(page), project.id).toEqual([[`project-${project.id}`, ...LANDED]]);
    }
  });
}

test("the hero links to the projects", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("section").first().getByRole("link", { name: "See projects" })).toHaveAttribute("href", "#projects");
});

test("list rows show year, context and tools on a phone, and screen readers get spaces", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 800 } });
  const page = await context.newPage();
  await page.goto("/");
  const row = page.locator("details.more").filter({ hasText: "S&S Rengøringsservice website" });
  await expect(row.locator(".more-meta")).toBeVisible();
  // The year comes from the timeline entry (the project has none), then the context.
  await expect(row.locator(".more-meta > span:not([aria-hidden]):not(.sr-only)")).toHaveText(["2023–now", "Work"]);
  await expect(row.locator(".more-tools")).toContainText("HTML");
  // The row's name keeps its parts apart for screen readers.
  // (sr-only commas are positioned boxes, so Chromium puts a space before each one.)
  expect(await row.locator("summary").ariaSnapshot()).toMatch(/S&S Rengøringsservice website ?, 2023–now ?, Work ?, HTML ?, CSS/);
  // aria-hidden dots must not glue the words together for screen readers.
  expect(await page.locator("article.featured .project-meta").first().ariaSnapshot()).toContain("2025 Internship");
  await context.close();
});
