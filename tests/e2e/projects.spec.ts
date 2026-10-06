import { readdirSync, readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { load } from "js-yaml";

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
      // Colours ease for 150 ms, so wait for the end state.
      await expect.poll(() => color(".lens-tech")).toBe("rgb(243, 240, 232)");
      await expect.poll(() => color("article.featured .view-tech", "background-color")).toBe("rgb(17, 17, 17)");
      await expect(first.locator(".view-business")).toBeHidden();
      await expect(first.locator(".view-tech")).toBeVisible();
      if (!isTodo(project.method[lang])) await expect(first.locator(".view-tech dd").first()).toHaveText(project.method[lang]);
      await expect(first.locator(".chips li").first()).toBeVisible();
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
  await expect(row.locator(".more-meta")).toContainText("Work");
  await expect(row.locator(".more-tools")).toContainText("HTML");
  // aria-hidden dots must not glue the words together for screen readers.
  expect(await page.locator("article.featured .project-meta").first().ariaSnapshot()).toContain("2025 Internship");
  expect(await page.locator("section#about .about-edu li").first().ariaSnapshot()).toMatch(/\(RUC\) 2026/);
  await context.close();
});
