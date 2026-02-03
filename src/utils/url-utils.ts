import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";

export function pathsEqual(path1: string, path2: string): boolean {
	const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
	const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
	return normalizedPath1 === normalizedPath2;
}

function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}

export function getPostUrlById(id: string): string {
	// Check if this is an English post
	if (id.startsWith("en/")) {
		// Remove the 'en/' prefix and add to /en/posts/ path
		return url(`/en/posts/${id.substring(3)}/`);
	}
	return url(`/posts/${id}/`);
}

export function getTagUrl(tag: string, locale?: string): string {
	if (!tag) return getLocalizedUrl("/archive/", locale);
	return getLocalizedUrl(`/archive/?tag=${encodeURIComponent(tag.trim())}`, locale);
}

export function getCategoryUrl(category: string | null, locale?: string): string {
	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() === i18n(I18nKey.uncategorized).toLowerCase()
	)
		return getLocalizedUrl("/archive/?uncategorized=true", locale);
	return getLocalizedUrl(`/archive/?category=${encodeURIComponent(category.trim())}`, locale);
}

export function getDir(path: string): string {
	const lastSlashIndex = path.lastIndexOf("/");
	if (lastSlashIndex < 0) {
		return "/";
	}
	return path.substring(0, lastSlashIndex + 1);
}

export function getCurrentLocale(pathname: string): "en" | "ja" {
	// Check if the pathname starts with /en/
	if (pathname.startsWith("/en/") || pathname === "/en") {
		return "en";
	}
	return "ja"; // Default locale
}

export function getLocalizedUrl(path: string, locale?: string): string {
	if (locale === "en") {
		// For English locale, prefix with /en
		return url(`/en${path}`);
	}
	// For Japanese (default), use path as-is
	return url(path);
}

export function url(path: string): string {
	return joinUrl("", import.meta.env.BASE_URL, path);
}
