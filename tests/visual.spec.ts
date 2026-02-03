import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
	test("homepage screenshot", async ({ page }) => {
		await page.goto("/", { waitUntil: "networkidle" });
		// Wait for fonts and styles to load completely
		await page.waitForFunction(() => document.fonts.ready, { timeout: 10000 });
		// Wait for CSS animations and layout stabilization
		await page.waitForTimeout(5000);
		await expect(page).toHaveScreenshot("homepage.png", { timeout: 30000 });
	});

	test("about page screenshot", async ({ page }) => {
		await page.goto("/about/", { waitUntil: "networkidle" });
		await page.waitForFunction(() => document.fonts.ready, { timeout: 10000 });
		await page.waitForTimeout(5000);
		await expect(page).toHaveScreenshot("about.png", { timeout: 30000 });
	});

	test("archive page screenshot", async ({ page }) => {
		await page.goto("/archive/", { waitUntil: "networkidle" });
		await page.waitForFunction(() => document.fonts.ready, { timeout: 10000 });
		await page.waitForTimeout(5000);
		await expect(page).toHaveScreenshot("archive.png", { timeout: 30000 });
	});

	test("blog post screenshot", async ({ page }) => {
		await page.goto("/posts/state-of-2024/", { waitUntil: "networkidle" });
		await page.waitForFunction(() => document.fonts.ready, { timeout: 10000 });
		await page.waitForTimeout(5000);
		await expect(page).toHaveScreenshot("blog-post.png", { timeout: 30000 });
	});

	test("mobile homepage screenshot", async ({ page, browserName }) => {
		// Test with mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/", { waitUntil: "networkidle" });
		await page.waitForFunction(() => document.fonts.ready, { timeout: 10000 });
		await page.waitForTimeout(5000);
		await expect(page).toHaveScreenshot(`mobile-homepage-${browserName}.png`, { timeout: 30000 });
	});

	test("dark mode homepage screenshot", async ({ page }) => {
		await page.goto("/", { waitUntil: "networkidle" });
		// Enable dark mode
		await page.evaluate(() => {
			document.documentElement.classList.add("dark");
		});
		await page.waitForFunction(() => document.fonts.ready, { timeout: 10000 });
		// Wait for dark mode styles to apply
		await page.waitForTimeout(5000);
		await expect(page).toHaveScreenshot("homepage-dark.png", { timeout: 30000 });
	});

	test("navigation menu screenshot", async ({ page }) => {
		await page.goto("/", { waitUntil: "networkidle" });
		await page.waitForFunction(() => document.fonts.ready, { timeout: 10000 });

		// Open navigation menu (for mobile view)
		const menuButton = page.locator(
			'[aria-label="メニューを開く"], [aria-label="Toggle menu"], button:has-text("Menu")',
		);
		if (await menuButton.isVisible()) {
			await menuButton.click();
			await page.waitForTimeout(1000); // Wait for animation completion
		}

		await page.waitForTimeout(2000);
		await expect(page).toHaveScreenshot("navigation-menu.png", { timeout: 30000 });
	});
});
