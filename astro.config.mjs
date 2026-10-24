import partytown from "@astrojs/partytown";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components"; /* Render the custom directive content */
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive"; /* Handle directives */
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkLinkCard from "remark-link-card-plus";
import remarkSectionize from "remark-sectionize";
import { expressiveCodeConfig } from "./src/config.ts";
import { pluginCustomCopyButton } from "./src/plugins/expressive-code/custom-copy-button.js";
import { pluginLanguageBadge } from "./src/plugins/expressive-code/language-badge.ts";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import { optimizeLinkCards } from "./src/plugins/optimize-link-cards.mjs";

// https://astro.build/config
export default defineConfig({
	site: "https://www.2k36.org",
	base: "/",
	trailingSlash: "ignore",
	i18n: {
		defaultLocale: "ja",
		locales: ["ja", "en"],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	integrations: [
		icon(),
		optimizeLinkCards(),
		expressiveCode({
			themes: [expressiveCodeConfig.theme],
			plugins: [
				pluginCollapsibleSections(),
				pluginLineNumbers(),
				pluginLanguageBadge(),
				pluginCustomCopyButton(),
			],
			defaultProps: {
				wrap: true,
				overridesByLang: {
					shellsession: {
						showLineNumbers: false,
					},
				},
			},
			styleOverrides: {
				codeBackground: "var(--codeblock-bg)",
				borderRadius: "0.75rem",
				borderColor: "none",
				codeFontSize: "0.875rem",
				codeFontFamily:
					"'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
				codeLineHeight: "1.5rem",
				frames: {
					editorBackground: "var(--codeblock-bg)",
					terminalBackground: "var(--codeblock-bg)",
					terminalTitlebarBackground: "var(--codeblock-topbar-bg)",
					editorTabBarBackground: "var(--codeblock-topbar-bg)",
					editorActiveTabBackground: "none",
					editorActiveTabIndicatorBottomColor: "var(--primary)",
					editorActiveTabIndicatorTopColor: "none",
					editorTabBarBorderBottomColor: "var(--codeblock-topbar-bg)",
					terminalTitlebarBorderBottomColor: "none",
				},
				textMarkers: {
					delHue: 0,
					insHue: 180,
					markHue: 250,
				},
			},
			frames: {
				showCopyToClipboardButton: false,
			},
		}),
		sitemap(),
		partytown({
			config: {
				forward: ["dataLayer.push"],
			},
		}),
	],
	markdown: {
		processor: unified({
			remarkPlugins: [
				remarkReadingTime,
				remarkExcerpt,
				remarkGithubAdmonitionsToDirectives,
				remarkDirective,
				[
					remarkLinkCard,
					{
						cache: true,
						shortenUrl: true,
						thumbnailPosition: "right",
						noFavicon: true,
					},
				],
				remarkSectionize,
				parseDirectiveNode,
			],
			rehypePlugins: [
				rehypeSlug,
				[
					rehypeComponents,
					{
						components: {
							github: GithubCardComponent,
							note: (x, y) => AdmonitionComponent(x, y, "note"),
							tip: (x, y) => AdmonitionComponent(x, y, "tip"),
							important: (x, y) => AdmonitionComponent(x, y, "important"),
							caution: (x, y) => AdmonitionComponent(x, y, "caution"),
							warning: (x, y) => AdmonitionComponent(x, y, "warning"),
						},
					},
				],
				[
					rehypeAutolinkHeadings,
					{
						behavior: "append",
						properties: {
							className: ["anchor"],
						},
						content: {
							type: "element",
							tagName: "span",
							properties: {
								className: ["anchor-icon"],
								"data-pagefind-ignore": true,
							},
							children: [
								{
									type: "text",
									value: "#",
								},
							],
						},
					},
				],
			],
		}),
	},
	prefetch: { prefetchAll: true },
	image: {
		layout: "constrained",
		responsiveStyles: true,
		breakpoints: [480, 960, 1600],
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
