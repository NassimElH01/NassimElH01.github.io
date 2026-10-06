import { readdirSync, readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { load } from "js-yaml";

type Localized = Record<"en" | "da", string>;
interface Project {
  id: string;
  title: Localized;
  result: Localized;
  method: Localized;
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

      await page.locator("#projects-lens-business").focus();
      await page.keyboard.press("ArrowRight");
      await expect(page.locator("#projects-lens-tech")).toBeChecked();
      await expect(first.locator(".view-business")).toBeHidden();
      await expect(first.locator(".view-tech")).toBeVisible();
      if (!isTodo(project.method[lang])) await expect(first.locator(".view-tech dd").first()).toHaveText(project.method[lang]);
      await expect(first.locator(".chips li").first()).toBeVisible();
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
  expect(featured.map((project) => project.id)).toEqual([
    "royal-unibrew-projectflow-power-bi",
    "royal-unibrew-hybrid-pmo-bachelor-project",
    "24support-christmas-calendar",
  ]);
  await page.goto("/");
  const section = page.locator("section#projects");
  const demo = section.getByRole("link", { name: "Open calendar demo" });
  await expect(demo).toHaveAttribute("href", "/freelance/24support-julekalender/index.html");
  expect((await page.request.get("/freelance/24support-julekalender/index.html")).ok()).toBe(true);
  await expect(section.locator('a[href="https://ss.ssrengoringsservice.dk/"]')).toHaveAttribute("rel", "noopener");
  await expect(section.locator('a[href="/budget-skabelon.xlsx"]')).toHaveAttribute("download", "");
  expect((await page.request.get("/budget-skabelon.xlsx")).ok()).toBe(true);
});

test("the hero links to the projects", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("section").first().getByRole("link", { name: "See projects" })).toHaveAttribute("href", "#projects");
});
