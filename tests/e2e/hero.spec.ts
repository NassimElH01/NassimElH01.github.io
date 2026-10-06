import { expect, test } from "@playwright/test";

test.describe("decode intro", () => {
  test("runs once per session, ends within 1.6 s and leaves the plain name", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "no-preference" });
    // Timestamp the intro's start and end inside the page; assertion polling is too coarse.
    await context.addInitScript(() => {
      const marks: Record<string, number> = {};
      Object.assign(window, { introMarks: marks });
      // documentElement does not exist yet when init scripts run, so watch the document.
      new MutationObserver(() => {
        const on = document.documentElement?.classList.contains("intro") ?? false;
        if (on && marks.start === undefined) marks.start = performance.now();
        if (!on && marks.start !== undefined && marks.end === undefined) marks.end = performance.now();
      }).observe(document, { subtree: true, attributes: true, attributeFilter: ["class"] });
    });
    const page = await context.newPage();
    await page.goto("/");
    // While it runs, the heading keeps its plain accessible name.
    await expect(page.getByRole("heading", { level: 1, name: "Nassim Hassani" })).toBeVisible();
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/\bintro\b/, { timeout: 2500 });
    const marks = await page.evaluate(() => (window as unknown as { introMarks: { start?: number; end?: number } }).introMarks);
    expect(marks.start).toBeDefined();
    expect(marks.end! - marks.start!).toBeLessThanOrEqual(1600);
    await expect(page.locator("h1")).toHaveText("Nassim Hassani");
    await expect(page.locator("h1 .decode-ch")).toHaveCount(0);
    await expect(page.locator(".intro-skip")).toHaveCount(0);

    await page.reload();
    await expect(html).not.toHaveClass(/\bintro\b/);
    await context.close();
  });

  test("Escape skips it at once", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "no-preference" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\bintro\b/);
    await page.keyboard.press("Escape");
    await expect(page.locator("html")).not.toHaveClass(/\bintro\b/, { timeout: 300 });
    await expect(page.locator("h1")).toHaveText("Nassim Hassani");
    await context.close();
  });

  test("the skip button ends it and hands focus to main", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "no-preference" });
    const page = await context.newPage();
    await page.goto("/da/");
    const skip = page.locator(".intro-skip");
    await expect(skip).toHaveText("Spring intro over");
    await skip.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).not.toHaveClass(/\bintro\b/, { timeout: 300 });
    await expect(page.locator("main#main")).toBeFocused();
    await context.close();
  });

  test("does not run under reduced motion or on a deep link", async ({ browser }) => {
    const calm = await browser.newContext({ reducedMotion: "reduce" });
    const calmPage = await calm.newPage();
    await calmPage.goto("/");
    await expect(calmPage.locator("html")).not.toHaveClass(/\bintro\b/);
    await expect(calmPage.locator("h1 .decode-ch")).toHaveCount(0);
    await calm.close();

    const deep = await browser.newContext({ reducedMotion: "no-preference" });
    const deepPage = await deep.newPage();
    await deepPage.goto("/#projects");
    await expect(deepPage.locator("html")).not.toHaveClass(/\bintro\b/);
    await deep.close();
  });
});

test.describe("bridge slider", () => {
  test("moves with the keyboard and announces both sides", async ({ page }) => {
    await page.goto("/");
    const handle = page.getByRole("slider", { name: "Drag the bridge between business and tech" });
    await expect(handle).toHaveAttribute("aria-valuenow", "50");
    await handle.focus();
    await page.keyboard.press("ArrowRight");
    await expect(handle).toHaveAttribute("aria-valuenow", "55");
    await expect(handle).toHaveAttribute("aria-valuetext", "55% business, 45% tech");
    await page.keyboard.press("End");
    await expect(handle).toHaveAttribute("aria-valuenow", "100");
    await page.keyboard.press("Home");
    await expect(handle).toHaveAttribute("aria-valuenow", "0");
    await page.keyboard.press("PageUp");
    await expect(handle).toHaveAttribute("aria-valuenow", "20");
    const split = await page.locator("[data-bridge]").evaluate((el) => el.style.getPropertyValue("--split"));
    expect(split).toBe("20");
  });

  test("follows a pointer drag", async ({ page }) => {
    await page.goto("/");
    // The handle is hidden while the intro builds the bridge.
    await page.waitForFunction(() => !document.documentElement.classList.contains("intro"));
    const bridge = page.locator("[data-bridge]");
    const handle = page.locator("[data-bridge-handle]");
    const box = (await bridge.boundingBox())!;
    const knob = (await handle.boundingBox())!;
    await page.mouse.move(knob.x + knob.width / 2, knob.y + knob.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.25, knob.y + knob.height / 2, { steps: 5 });
    await page.mouse.up();
    const value = Number(await handle.getAttribute("aria-valuenow"));
    expect(value).toBeGreaterThanOrEqual(23);
    expect(value).toBeLessThanOrEqual(27);
  });

  test("a tap on a panel moves the bridge there", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    const bridge = page.locator("[data-bridge]");
    const box = (await bridge.boundingBox())!;
    await page.mouse.click(box.x + box.width * 0.3, box.y + 20);
    const value = Number(await page.locator("[data-bridge-handle]").getAttribute("aria-valuenow"));
    expect(value).toBeGreaterThanOrEqual(28);
    expect(value).toBeLessThanOrEqual(32);
    await context.close();
  });

  test("on a phone the handle never covers the copy", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 800 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    const handle = page.locator("[data-bridge-handle]");
    for (const key of ["Home", "PageUp", "PageUp", "PageUp", "End"]) {
      await handle.focus();
      await page.keyboard.press(key);
      const knob = (await handle.boundingBox())!;
      for (const selector of [".bridge-business-text", ".bridge-tech-text"]) {
        const copy = (await page.locator(selector).boundingBox())!;
        const overlaps = knob.y < copy.y + copy.height && copy.y < knob.y + knob.height;
        expect(overlaps, `${key}: handle over ${selector}`).toBe(false);
      }
      expect(knob.x).toBeGreaterThanOrEqual(0);
      expect(knob.x + knob.width).toBeLessThanOrEqual(375);
    }
    await context.close();
  });

  test("without JavaScript both statements show and the handle is hidden", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("[data-bridge-handle]")).toBeHidden();
    await expect(page.locator(".bridge-business-text")).toBeVisible();
    await expect(page.locator(".bridge-tech-text")).toBeVisible();
    const [business, tech] = await Promise.all([
      page.locator("#bridge-business").boundingBox(),
      page.locator("#bridge-tech").boundingBox(),
    ]);
    expect(Math.abs(business!.width - tech!.width)).toBeLessThanOrEqual(1);
    await context.close();
  });
});

test("the hero states only facts from content/", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("#top");
  await expect(hero.locator("dl")).toContainText("MSc in Digital Transformation");
  await expect(hero.locator("dl")).toContainText("Roskilde University (RUC) · 2026–2028");
  await expect(hero.locator("dl")).toContainText("Royal Unibrew");
  await expect(hero.locator("dl")).toContainText("Junior Project Manager / PMO Intern · 2025");
  await expect(hero.locator("dl")).toContainText("PRINCE2 Practitioner");
  await expect(hero.locator("dl")).toContainText("Danish · English · Arabic · German");
  await expect(hero.getByRole("link", { name: "Get in touch" })).toHaveAttribute("href", "mailto:naselh01@gmail.com");
  await expect(hero).toContainText("I'm looking for a student job alongside my MSc at RUC.");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Looking for a student job\.$/);
});
