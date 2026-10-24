import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	// Keep third-party scripts out of these local behavior checks.
	await page.route("https://**/*", (route) => route.fulfill({ body: "" }));
});

test("theme selection and system preference survive navigation", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "dark" });
	await page.goto("/");
	await expect(page.locator("html")).toHaveClass(/dark/);
	await page.locator("#scheme-switch").click();
	await expect(page.locator("html")).not.toHaveClass(/dark/);
	await page.locator("#scheme-switch").click();
	await expect(page.locator("html")).toHaveClass(/dark/);
	await page.locator('[aria-label="Go to About Page"]').click();
	await expect(page).toHaveURL(/\/about\/?$/);
	await expect(page.locator("html")).toHaveClass(/dark/);
	await page.locator("#scheme-switch").click();
	await page.emulateMedia({ colorScheme: "light" });
	await expect(page.locator("html")).not.toHaveClass(/dark/);
	await expect(page.locator("html")).toHaveAttribute("data-theme-mode", "auto");
});

test("language links retain archive filters and the fragment", async ({ page }) => {
	await page.goto("/archive/?tag=rust#top");
	await page.locator("#lang-switch").click();
	await expect(page).toHaveURL(/\/en\/archive\/\?tag=rust#top$/);
	await expect(page.locator("html")).toHaveAttribute("lang", "en");
	await expect(page.locator("#lang-switch")).toHaveAttribute("href", "/archive/");
	await page.locator("#lang-switch").click();
	await expect(page).toHaveURL(/\/archive\/\?tag=rust#top$/);
	await expect(page.locator("html")).toHaveAttribute("lang", "ja");
});

test("archive filtering updates visible posts and yearly counts", async ({ page }) => {
	await page.goto("/archive/?tag=diary&category=diary");
	await expect(
		page.locator('[data-archive-post][href="/posts/new-pc-builds-2025/"]'),
	).toBeVisible();
	await expect(
		page.locator('[data-archive-post][href="/posts/2026-september-report/"]'),
	).toBeHidden();
	const visiblePosts = page.locator("[data-archive-post]:visible");
	expect(await visiblePosts.count()).toBeGreaterThan(0);
	const counts = await page
		.locator("[data-archive-year]:visible [data-post-count]")
		.allTextContents();
	expect(counts.reduce((sum, count) => sum + Number(count), 0)).toBe(await visiblePosts.count());
	await page.goto("/archive/?tag=not-a-real-tag");
	await expect(page.locator("[data-archive-year]:visible")).toHaveCount(0);
	await page.goto("/en/archive/?category=Zenn");
	await expect(page.locator("[data-archive-post]:visible").first()).toHaveAttribute(
		"href",
		/^https:\/\/zenn\.dev\//,
	);
	await expect(
		page.locator('[data-archive-post][href="/en/posts/new-pc-builds-2025/"]'),
	).toBeHidden();
});

test("search loads its index on demand and clears old results", async ({ page, isMobile }) => {
	const requests: string[] = [];
	page.on("request", (request) => requests.push(request.url()));
	await page.goto("/", { waitUntil: "networkidle" });
	expect(requests.some((url) => url.includes("/pagefind/"))).toBe(false);
	expect(requests.some((url) => /api\.iconify|photoswipe|overlayscrollbars|giscus/.test(url))).toBe(
		false,
	);
	if (isMobile) await page.locator("#search-switch").click();
	const input = page.locator("[data-search-input]:visible");
	await input.fill("Rust");
	await expect(page.locator("#search-results a").first()).toBeVisible();
	expect(requests.some((url) => url.includes("/pagefind/pagefind.js"))).toBe(true);
	await input.fill("compiler");
	await input.fill("");
	await expect(page.locator("#search-results a")).toHaveCount(0);
	await input.fill("Rust");
	await expect(page.locator("#search-results a").first()).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(page.locator("#search-panel")).toHaveClass(/float-panel-closed/);
});

test("article images open after navigation and comments load near the viewport", async ({
	page,
}) => {
	const requests: string[] = [];
	page.on("request", (request) => requests.push(request.url()));
	await page.goto("/archive/?category=diary");
	await page.locator('[data-archive-post][href="/posts/new-pc-builds-2025/"]').click();
	await expect(page).toHaveURL(/\/posts\/new-pc-builds-2025\/?$/);
	expect(requests.some((url) => url.includes("giscus.app/client.js"))).toBe(false);
	const cover = page.locator("#post-cover img");
	await expect(cover).toHaveAttribute("srcset", /480w.*960w.*1600w/);
	await cover.click();
	await expect(page.locator(".pswp--open")).toBeVisible();
	await expect(page.locator(".pswp__img").last()).toBeVisible();
	await expect(page.locator(".pswp__top-bar")).toHaveCSS("opacity", "1");
	await page.locator(".pswp__button--close").click();
	await expect(page.locator(".pswp--open")).toHaveCount(0);
	await page.locator("#giscus_container").scrollIntoViewIfNeeded();
	await expect
		.poll(() => requests.filter((url) => url.includes("giscus.app/client.js")).length)
		.toBe(1);
	await page.locator("#post-cover").scrollIntoViewIfNeeded();
	await cover.click();
	await expect(page.locator(".pswp--open")).toHaveCount(1);
});

test("content and icons are visible without JavaScript", async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto("/");
	await expect(page.locator("#content-wrapper")).toHaveCSS("opacity", "1");
	await expect(page.locator("#navbar [data-icon]").first()).toBeVisible();
	await expect(page.locator("astro-island")).toHaveCount(0);
	await context.close();
});
