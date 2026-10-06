import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { load } from "js-yaml";

// The approved wording (content/profile.yaml), whitespace-collapsed.
const profile = (load(readFileSync("content/profile.yaml", "utf8")) as { summary: Record<"en" | "da", string> }[])[0];
const collapse = (text: string) => text.replace(/\s+/g, " ").trim();

const CASES = [
  {
    lang: "en" as const,
    path: "/",
    heading: "About",
    opening: "Hi, I'm Nassim",
    offer: "In a student job, I'd bring structure, follow-up and data that people can act on.",
    role: "junior project manager and PMO intern",
    across: "I planned work in Azure DevOps, built Power BI dashboards that management used",
    education: ["MSc in Digital Transformation", "Roskilde University (RUC) · 2026 – expected 2028", "Professional Bachelor's in Business Economics & IT"],
    cv: "CV (Danish, PDF)",
    security: "PwC Security Awareness: Cybersecurity Practitioner · 2024",
    languages: ["Danish", "Native", "German", "Intermediate"],
    portrait: "Portrait of Nassim Hassani",
  },
  {
    lang: "da" as const,
    path: "/da/",
    heading: "Om mig",
    opening: "Hej, jeg hedder Nassim.",
    offer: "I et studiejob kan jeg bidrage med struktur, opfølgning og data, der er til at handle på.",
    role: "junior projektleder og PMO-praktikant",
    across: "Jeg planlagde arbejdet i Azure DevOps, byggede Power BI-dashboards, som ledelsen brugte",
    education: ["Cand.it. i Digital Transformation", "Roskilde University (RUC) · 2026 – forventet 2028", "Professionsbachelor i Økonomi & IT"],
    cv: "Hent CV",
    security: "PwC Security Awareness: Praktiserende i cybersikkerhed · 2024",
    languages: ["Dansk", "Modersmål", "Tysk", "Øvet"],
    portrait: "Portræt af Nassim Hassani",
  },
];

for (const item of CASES) {
  test.describe(`About on ${item.path}`, () => {
    test("shows the approved text: lead, emphasised body, offer", async ({ page }) => {
      await page.goto(item.path);
      const about = page.locator("section#about");
      await expect(about.getByRole("heading", { level: 2 })).toHaveText(item.heading);
      const paragraphs = about.locator(".about-text > div > p");
      await expect(paragraphs).toHaveCount(3);
      await expect(paragraphs.first()).toContainText(item.opening);
      await expect(paragraphs.last()).toHaveText(item.offer);
      // Emphasis wraps words; it never changes them.
      const joined = (await paragraphs.allTextContents()).join(" ");
      expect(collapse(joined)).toBe(collapse(profile.summary[item.lang]));
      const body = paragraphs.nth(1);
      await expect(body.locator("strong")).toHaveText([item.role]);
      await expect(body.locator(".font-mono")).toHaveText(["Azure DevOps", "Power BI"]);
      await expect(body).toContainText(item.across);
    });

    test("ends on the next step: mail, CV and LinkedIn", async ({ page }) => {
      await page.goto(item.path);
      const actions = page.locator("section#about .about-text ul");
      await expect(actions.locator("a")).toHaveCount(3);
      await expect(actions.locator('a[href="mailto:naselh01@gmail.com"]')).toBeVisible();
      const cv = actions.getByRole("link", { name: item.cv });
      await expect(cv).toHaveAttribute("href", "/Nassim-Hassani-CV.pdf");
      await expect(cv).toHaveAttribute("hreflang", "da");
      await expect(actions.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", /linkedin\.com\/in\//);
    });

    test("lists education, certifications with years, and languages from content/", async ({ page }) => {
      await page.goto(item.path);
      const about = page.locator("section#about");
      for (const text of item.education) await expect(about).toContainText(text);
      const certifications = about.locator(".about-certs ul > li");
      await expect(certifications).toHaveCount(8);
      await expect(certifications.nth(0)).toHaveText("PRINCE2 Foundation · Mentorix · 2025");
      await expect(certifications.nth(2)).toHaveText("Agile Project Management · BlivProjektleder.dk · 2024 · ID A4291-172");
      // The issuer is not repeated when the name already starts with it.
      await expect(certifications.nth(3)).toHaveText("IBM Data Analytics · 2023");
      await expect(certifications.nth(5)).toHaveText(item.security);
      await expect(about.getByRole("link", { name: /LinkedIn$/ }).last()).toHaveAttribute(
        "href",
        "https://www.linkedin.com/in/nassim-hassani-63835a220/details/certifications/",
      );
      await expect(about.locator("dl > div")).toHaveCount(4);
      for (const text of item.languages) await expect(about).toContainText(text);
      await expect(about.getByRole("img", { name: item.portrait })).toBeVisible();
      await expect(about.locator("[data-todo]")).toHaveCount(0);
      await expect(about).not.toContainText("TODO");
      await expect(about).not.toContainText("Royal Unibrew");
    });
  });
}

test("the CV file is a PDF", async ({ request }) => {
  const response = await request.get("/Nassim-Hassani-CV.pdf");
  expect(response.ok()).toBe(true);
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("the About link lands the section just under the sticky header on a phone", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 800 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await page.locator('header nav a[href="#about"]').click();
  await page.waitForURL(/#about$/);
  const gap = await page.evaluate(() => {
    const header = document.querySelector("header")!.getBoundingClientRect();
    const section = document.querySelector("#about")!.getBoundingClientRect();
    return section.top - header.bottom;
  });
  expect(gap).toBeGreaterThanOrEqual(0);
  expect(gap).toBeLessThanOrEqual(16);
  await context.close();
});
