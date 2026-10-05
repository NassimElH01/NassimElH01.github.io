import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  { path: "/", lang: "en" },
  { path: "/da/", lang: "da" },
] as const;

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function axe(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  return results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

for (const { path, lang } of PAGES) {
  test.describe(`page ${path}`, () => {
    for (const colorScheme of ["light", "dark"] as const) {
      test(`has no axe violations (${colorScheme})`, async ({ browser }) => {
        const context = await browser.newContext({ colorScheme });
        const page = await context.newPage();
        await page.goto(path);
        expect(await axe(page)).toEqual([]);
        await context.close();
      });
    }

    test("declares its language and alternates", async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(3);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toMatch(/\/$/);
    });

    test("has one h1 and one main landmark", async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main")).toHaveCount(1);
    });

    test("loads only same-origin resources, fonts from /_astro/fonts/", async ({ page, baseURL }) => {
      const urls: string[] = [];
      page.on("request", (request) => urls.push(request.url()));
      await page.goto(path, { waitUntil: "networkidle" });
      const origin = new URL(baseURL!).origin;
      expect(urls.filter((url) => !url.startsWith(origin) && !url.startsWith("data:"))).toEqual([]);
      const fonts = urls.filter((url) => /\.(woff2?|ttf|otf)(\?|$)/.test(url));
      expect(fonts.every((url) => new URL(url).pathname.startsWith("/_astro/fonts/"))).toBe(true);
    });

    for (const width of [320, 375]) {
      test(`has no horizontal scroll at ${width}px`, async ({ browser }) => {
        const context = await browser.newContext({ viewport: { width, height: 800 } });
        const page = await context.newPage();
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
        await context.close();
      });
    }
  });
}

test("the first Tab reaches the skip link, which moves focus to main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("the footer offers the confirmed email and phone", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('footer a[href="mailto:naselh01@gmail.com"]')).toHaveText("naselh01@gmail.com");
  await expect(page.locator('footer a[href="tel:+4524770784"]')).toHaveText("+45 24 77 07 84");
});

test("the language link points at the same page in the other language", async ({ page }) => {
  await page.goto("/");
  const link = page.locator('header a[hreflang="da"]');
  await expect(link).toHaveAttribute("href", "/da/");
  await expect(link).toHaveText("Dansk");
});

test.describe("theme", () => {
  test("toggles with the keyboard, persists, and clears storage when back on system", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/");
    const toggle = page.locator("[data-theme-toggle]");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");

    await toggle.focus();
    await page.keyboard.press("Space");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.locator("[data-theme-toggle]").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
    await context.close();
  });

  test("drops unknown stored values such as next-themes' 'system'", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    await context.addInitScript(() => localStorage.setItem("theme", "system"));
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
    const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(background).toBe("rgb(14, 14, 14)");
    await context.close();
  });

  test("follows a dark system preference without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "dark", javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(background).toBe("rgb(14, 14, 14)");
    await context.close();
  });
});

test("without a reduced-motion preference, transitions run and scrolling is smooth", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.goto("/");
  const styles = await page.evaluate(() => ({
    transition: getComputedStyle(document.querySelector(".skip-link")!).transitionDuration,
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  expect(parseFloat(styles.transition)).toBeGreaterThan(0.1);
  expect(styles.scroll).toBe("smooth");
  await context.close();
});

test("reduced motion turns transitions and smooth scrolling off", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  const styles = await page.evaluate(() => ({
    transition: getComputedStyle(document.querySelector(".skip-link")!).transitionDuration,
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  expect(parseFloat(styles.transition)).toBeLessThanOrEqual(0.001);
  expect(styles.scroll).toBe("auto");
  await context.close();
});

test.describe("404 page", () => {
  test("is served with status 404, noindex, in both languages", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist/");
    expect(response?.status()).toBe(404);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator("h1")).toHaveText("Page not found");
    await expect(page.locator('section[lang="da"] h2')).toHaveText("Siden findes ikke");
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`has no axe violations (${colorScheme})`, async ({ browser }) => {
      const context = await browser.newContext({ colorScheme });
      const page = await context.newPage();
      await page.goto("/this-page-does-not-exist/");
      expect(await axe(page)).toEqual([]);
      await context.close();
    });
  }
});

test("old /cv/<id> URLs redirect to the matching section", async ({ page }) => {
  await page.goto("/cv/royal-unibrew-pmo/");
  await page.waitForURL(/\/#experience$/);
  await page.goto("/cv/royal-unibrew-bachelor-project/");
  await page.waitForURL(/\/#projects$/);
  await page.goto("/ascensioncards/");
  await page.waitForURL(/:\d+\/$/);
  await expect(page.locator("h1")).toHaveText("Nassim Hassani");
});

test("header tab order follows the visual order on desktop", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("/");
  const order: string[] = [];
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    order.push(await page.evaluate(() => document.activeElement?.textContent?.trim() ?? ""));
  }
  expect(order).toEqual([
    "Skip to content",
    "Nassim Hassani",
    "About",
    "Skills",
    "Projects",
    "Experience & education",
    "Playground",
    "Contact",
    "Dansk",
    "Dark theme",
  ]);
  await context.close();
});

test("focused nav links keep their whole focus ring inside the scroll container", async ({ browser }) => {
  for (const width of [375, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 800 } });
    const page = await context.newPage();
    await page.goto("/");
    const fits = await page.evaluate(() => {
      const nav = document.querySelector("header nav")!.getBoundingClientRect();
      const first = document.querySelector("header nav a")!.getBoundingClientRect();
      const ring = 4; // 2px outline + 2px offset
      return first.top - ring >= nav.top && first.bottom + ring <= nav.bottom && first.left - ring >= nav.left;
    });
    expect(fits).toBe(true);
    await context.close();
  }
});

test("sitemaps list both languages and skip redirect stubs", async ({ request }) => {
  const index = await request.get("/sitemap-index.xml");
  expect(index.ok()).toBe(true);
  const urls = await (await request.get("/sitemap-0.xml")).text();
  expect(urls).toContain("<loc>https://nassimelh01.github.io/</loc>");
  expect(urls).toContain("<loc>https://nassimelh01.github.io/da/</loc>");
  expect(urls).not.toContain("/cv/");
  const alias = await request.get("/sitemap.xml");
  expect(await alias.text()).toContain("sitemap-0.xml");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://nassimelh01.github.io/sitemap-index.xml");
});

test("the freelance demo in public/ is still served unchanged", async ({ request }) => {
  const response = await request.get("/freelance/24support-julekalender/index.html");
  expect(response.ok()).toBe(true);
});

test("the budget template is downloadable at its old URL", async ({ request }) => {
  const response = await request.get("/budget-skabelon.xlsx");
  expect(response.ok()).toBe(true);
  expect((await response.body()).subarray(0, 2).toString()).toBe("PK");
});
