import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { parse } from "node-html-parser";

const converter = new NodeHtmlMarkdown({ bulletMarker: "-", codeBlockStyle: "fenced" });

export function htmlToMarkdown(html, pageUrl) {
	const document = parse(html, {
		blockTextElements: { script: true, style: true, noscript: true },
	});
	const content =
		document.querySelector(".markdown-content") ?? document.querySelector("#main-content");
	if (!content) throw new Error(`Page has no main content: ${pageUrl}`);

	for (const node of content.querySelectorAll(
		"script, style, template, svg, button, nav, footer, .footer, .anchor, #giscus_container",
	)) {
		node.remove();
	}

	// Expressive Code renders line numbers and syntax highlighting inside <pre>.
	for (const pre of content.querySelectorAll("pre[data-language]")) {
		const code = parse("<code></code>").firstChild;
		code.setAttribute("class", `language-${pre.getAttribute("data-language")}`);
		code.textContent = pre
			.querySelectorAll(".ec-line .code")
			.map((line) => (line.textContent === "\n" ? "" : line.textContent))
			.join("\n");
		pre.set_content(code);
	}

	for (const node of content.querySelectorAll("a[href], img[src]")) {
		const attribute = node.tagName === "A" ? "href" : "src";
		if (node.tagName === "A" && !node.textContent.trim() && !node.querySelector("img")) {
			node.remove();
			continue;
		}
		node.setAttribute(attribute, new URL(node.getAttribute(attribute), pageUrl).href);
	}

	const title =
		document.querySelector('[data-pagefind-meta="title"]')?.textContent ??
		document.querySelector("title").textContent;
	const heading = content.querySelector("h1") ? "" : `# ${title}\n\n`;
	return `${heading}${converter.translate(content.innerHTML)}\n`;
}

export function markdownForAgents() {
	let site;
	return {
		name: "markdown-for-agents",
		hooks: {
			"astro:config:done": ({ config }) => {
				site = config.site;
			},
			"astro:build:done": async ({ dir, pages, logger }) => {
				const output = fileURLToPath(dir);
				for (const { pathname } of pages) {
					if (pathname === "404.html") continue;
					const filename = path.join(pathname, "index.html");
					const html = await readFile(path.join(output, filename), "utf8");
					const markdown = htmlToMarkdown(html, new URL(pathname, site));
					const target = path.join(output, "markdown", pathname, "index.md");
					await mkdir(path.dirname(target), { recursive: true });
					await writeFile(target, markdown);
				}
				logger.info("Generated Markdown versions of HTML pages");
			},
		},
	};
}
