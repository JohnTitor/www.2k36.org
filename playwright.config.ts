import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: false,
	retries: 0,
	workers: undefined,
	reporter: "html",
	timeout: 60000, // 60 seconds timeout
	use: {
		baseURL: "http://localhost:4321",
		trace: "on-first-retry",
		actionTimeout: 10000, // Action timeout
		navigationTimeout: 30000, // Navigation timeout
	},

	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				// More stable execution in headless mode
				launchOptions: {
					args: ["--disable-web-security", "--disable-features=VizDisplayCompositor"],
				},
			},
		},

		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},

		/* Test against mobile viewports. */
		{
			name: "Mobile Chrome",
			use: { ...devices["Pixel 5"] },
		},
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: "pnpm dev",
		url: "http://localhost:4321",
		reuseExistingServer: true,
		timeout: 120000, // 2 minutes timeout
	},

	// Visual comparison settings
	expect: {
		// Animation handling for screenshots
		toHaveScreenshot: {
			threshold: 0.2,
			animations: "disabled",
		},
	},
});
