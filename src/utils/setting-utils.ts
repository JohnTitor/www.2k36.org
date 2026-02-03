import { AUTO_MODE, DARK_MODE, DEFAULT_THEME, LIGHT_MODE } from "@constants/constants.ts";
import { expressiveCodeConfig, siteConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
const isStoredTheme = (value: string | null): value is LIGHT_DARK_MODE =>
	value === LIGHT_MODE || value === DARK_MODE || value === AUTO_MODE;

export function getDefaultHue(): number {
	const fallback = String(siteConfig.themeColor.hue);
	if (!isBrowser) {
		return Number.parseInt(fallback, 10);
	}
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

export function getHue(): number {
	if (!isBrowser) {
		return getDefaultHue();
	}
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
	if (!isBrowser) return;
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) return;
	r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE): void {
	if (!isBrowser) return;
	switch (theme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			break;
		case AUTO_MODE:
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			break;
	}

	// Set the theme for Expressive Code
	document.documentElement.setAttribute("data-theme", expressiveCodeConfig.theme);
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	if (!isBrowser) return;
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	if (!isBrowser) return DEFAULT_THEME as LIGHT_DARK_MODE;
	const stored = localStorage.getItem("theme");
	return isStoredTheme(stored) ? stored : (DEFAULT_THEME as LIGHT_DARK_MODE);
}
