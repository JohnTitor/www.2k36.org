import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { getTransformedRoutes, type RouteWithSrc } from "@vercel/routing-utils";
import { htmlToMarkdown } from "../src/plugins/markdown-for-agents.mjs";

const config = JSON.parse(readFileSync("vercel.json", "utf8"));
const { routes, error } = getTransformedRoutes(config);
if (error) throw new Error(error.message);

// Check the deployment rules separately: Astro preview does not apply vercel.json.
function routeRequest(pathname: string, accept = "", method = "GET") {
	const headers: Record<string, string> = {};
	for (const route of routes as RouteWithSrc[]) {
		const pattern = new RegExp(route.src);
		if (!pattern.test(pathname) || (route.methods && !route.methods.includes(method))) continue;
		if (
			route.has &&
			!route.has.every((condition) => new RegExp(String(condition.value)).test(accept))
		) {
			continue;
		}
		Object.assign(headers, route.headers);
		if (route.dest) return { pathname: pathname.replace(pattern, route.dest), headers };
	}
	return { pathname, headers };
}

test("Vercel selects Markdown for explicit Accept headers on GET and HEAD", () => {
	for (const accept of [
		"text/markdown",
		"text/markdown;q=0.8",
		"text/html, text/markdown",
		"TEXT/MARKDOWN",
	]) {
		for (const method of ["GET", "HEAD"]) {
			for (const pathname of ["/", "/about", "/about/", "/en/posts/state-of-2025/"]) {
				const result = routeRequest(pathname, accept, method);
				expect(result.pathname).toBe(`/markdown${pathname.replace(/\/$/, "")}/index.md`);
				expect(result.headers["Content-Type"]).toBe("text/markdown; charset=utf-8");
				expect(result.headers.Vary).toBe("Accept");
			}
		}
	}
	expect(routeRequest("/", "text/markdown").headers.Link).toContain('rel="api-catalog"');
});

test("HTML stays the default and non-HTML resources keep their routes", () => {
	for (const accept of [
		"",
		"*/*",
		"text/html",
		"text/markdown;q=0",
		"text/markdown;q=0.000, text/html",
		"text/markdown-extra",
	]) {
		const result = routeRequest("/about/", accept);
		expect(result.pathname).toBe("/about/");
		expect(result.headers["Content-Type"]).toBeUndefined();
		expect(result.headers.Vary).toBe("Accept");
	}
	for (const pathname of [
		"/rss.xml",
		"/robots.txt",
		"/.well-known/api-catalog",
		"/api/status.json",
		"/_astro/script.js",
	]) {
		expect(routeRequest(pathname, "text/markdown").pathname).toBe(pathname);
	}
	expect(routeRequest("/", "text/markdown", "POST").pathname).toBe("/");
	expect(
		routeRequest("/.well-known/api-catalog", "text/markdown").headers["Content-Type"],
	).toContain("application/linkset+json");
	expect(routeRequest("/pagefind/fragment/example.pf_fragment").headers["Cache-Control"]).toContain(
		"immutable",
	);
	expect(routeRequest("/og/example.jpg").headers["Cache-Control"]).toBe("public, max-age=86400");
});

test("generated Markdown preserves content, code, tables, and image URLs", async ({ request }) => {
	for (const pathname of [
		"/",
		"/about/",
		"/archive/",
		"/docs/api/",
		"/en/docs/api/",
		"/2/",
		"/en/",
	]) {
		const destination = routeRequest(pathname, "text/markdown").pathname;
		const response = await request.get(destination);
		expect(response.status(), destination).toBe(200);
		expect(response.headers()["content-type"]).toContain("text/markdown");
		const markdown = await response.text();
		expect(markdown).toMatch(/^# /);
		expect(markdown).not.toMatch(/<script|<style|giscus|All Rights Reserved/);
	}

	const article = await request.get("/markdown/posts/rust-phf-0-14-0/index.md");
	const markdown = await article.text();
	expect(markdown).toContain('```toml\n[dependencies]\nphf = { version = "0.14.0"');
	expect(markdown).toContain("static MAP: phf::Map<&'static str, u32>");
	expect(markdown).not.toContain("Share on Bluesky");
	const about = await request.get("/markdown/about/index.md");
	expect(await about.text()).toMatch(/\| 期間\s+\| 企業/);
	const images = await request.get("/markdown/posts/new-pc-builds-2025/index.md");
	expect(await images.text()).toMatch(/!\[.*?\]\(https:\/\/www\.2k36\.org\/_astro\//);
	const html = await request.get("/");
	expect(html.headers()["content-type"]).toContain("text/html");
});

test("HTML conversion resolves relative links and preserves code characters", () => {
	const markdown = htmlToMarkdown(
		`
		<title>Example</title><nav>Navigation</nav><main id="main-content">
		<p><a href="../other/">Other</a><img src="image.png" alt="Image"></p>
		<pre data-language="rust"><code><div class="ec-line"><div class="gutter">1</div><div class="code">let value = a &lt; b &amp;&amp; b &gt; c;</div></div></code></pre>
		<script>ignore()</script><footer>Footer</footer></main>`,
		"https://www.2k36.org/posts/example/",
	);
	expect(markdown).toContain("[Other](https://www.2k36.org/posts/other/)");
	expect(markdown).toContain("![Image](https://www.2k36.org/posts/example/image.png)");
	expect(markdown).toContain("```rust\nlet value = a < b && b > c;\n```");
	expect(markdown).not.toMatch(/Navigation|ignore|Footer/);
});
