import { expect, test } from "@playwright/test";

const CASES = [
  {
    path: "/",
    heading: "About",
    opening: "Hi, I'm Nassim",
    education: ["MSc in Digital Transformation", "Roskilde University (RUC) · 2026 – expected 2028", "Professional Bachelor's in Business Economics & IT"],
    languages: ["Danish", "Native", "German", "Intermediate"],
  },
  {
    path: "/da/",
    heading: "Om mig",
    opening: "Hej, jeg hedder Nassim.",
    education: ["Cand.it. i Digital Transformation", "Roskilde University (RUC) · 2026 – forventet 2028", "Professionsbachelor i Økonomi & IT"],
    languages: ["Dansk", "Modersmål", "Tysk", "Øvet"],
  },
] as const;

for (const item of CASES) {
  test(`About on ${item.path} shows the approved text and the facts from content/`, async ({ page }) => {
    await page.goto(item.path);
    const about = page.locator("section#about");
    await expect(about.getByRole("heading", { level: 2 })).toHaveText(item.heading);
    // Two paragraphs, split from the approved summary in content/profile.yaml.
    await expect(about.locator(".lg\\:col-span-7 p")).toHaveCount(2);
    await expect(about.locator(".lg\\:col-span-7 p").first()).toContainText(item.opening);
    for (const text of item.education) await expect(about).toContainText(text);
    // All seven certifications, with the issuer, never a TODO year.
    const certifications = about.locator("h3 + ul.grid > li");
    await expect(certifications).toHaveCount(7);
    await expect(certifications.first()).toHaveText("PRINCE2 Foundation · Mentorix · 2025");
    await expect(about).toContainText("PwC HackSchool");
    await expect(about.locator("dl > div")).toHaveCount(4);
    for (const text of item.languages) await expect(about).toContainText(text);
    await expect(about.locator("[data-todo]")).toHaveCount(0);
    await expect(about).not.toContainText("TODO");
    await expect(about).not.toContainText("Royal Unibrew");
  });
}
