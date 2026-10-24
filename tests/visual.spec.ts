import { test, expect, type Page } from "@playwright/test";

async function prepareScreenshot(page: Page): Promise<void> {
	await page.evaluate(async () => {
		await document.fonts.ready;
		for (const svg of document.querySelectorAll("svg")) {
			svg.pauseAnimations();
			svg.setCurrentTime(1);
		}
	});
}

test.describe("Visual Regression Tests", () => {
	test.beforeEach(async ({ page }) => {
		await page.route("https://**/*", (route) => route.fulfill({ body: "" }));
	});
	test("homepage screenshot", async ({ page }) => {
		expect((await page.goto("/", { waitUntil: "networkidle" }))?.status()).toBe(200);
		await prepareScreenshot(page);
		await expect(page).toHaveScreenshot("homepage.png", { timeout: 30000 });
	});

	test("about page screenshot", async ({ page }) => {
		expect((await page.goto("/about/", { waitUntil: "networkidle" }))?.status()).toBe(200);
		await prepareScreenshot(page);
		await expect(page).toHaveScreenshot("about.png", { timeout: 30000 });
	});

	test("archive page screenshot", async ({ page }) => {
		expect((await page.goto("/archive/", { waitUntil: "networkidle" }))?.status()).toBe(200);
		await prepareScreenshot(page);
		await expect(page).toHaveScreenshot("archive.png", { timeout: 30000 });
	});

	test("blog post screenshot", async ({ page }) => {
		expect((await page.goto("/posts/state-of-2025/", { waitUntil: "networkidle" }))?.status()).toBe(
			200,
		);
		await prepareScreenshot(page);
		await expect(page).toHaveScreenshot("blog-post.png", { timeout: 30000 });
	});

	test("mobile homepage screenshot", async ({ page, browserName }) => {
		// Test with mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		expect((await page.goto("/", { waitUntil: "networkidle" }))?.status()).toBe(200);
		await prepareScreenshot(page);
		await expect(page).toHaveScreenshot(`mobile-homepage-${browserName}.png`, { timeout: 30000 });
	});

	test("dark mode homepage screenshot", async ({ page }) => {
		expect((await page.goto("/", { waitUntil: "networkidle" }))?.status()).toBe(200);
		// Enable dark mode
		await page.evaluate(() => {
			document.documentElement.classList.add("dark");
		});
		await prepareScreenshot(page);
		await expect(page).toHaveScreenshot("homepage-dark.png", { timeout: 30000 });
	});

	test("navigation menu screenshot", async ({ page }) => {
		expect((await page.goto("/", { waitUntil: "networkidle" }))?.status()).toBe(200);

		// Open navigation menu (for mobile view)
		const menuButton = page.locator("#nav-menu-switch");
		if (await menuButton.isVisible()) {
			await menuButton.click();
			await expect(page.locator("#nav-menu-panel")).not.toHaveClass(/float-panel-closed/);
		}

		await prepareScreenshot(page);
		await expect(page).toHaveScreenshot("navigation-menu.png", { timeout: 30000 });
	});
});
