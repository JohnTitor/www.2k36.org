import rss from "@astrojs/rss";
import { getSortedPosts } from "@utils/content-utils";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { siteConfig } from "@/config";

const parser = new MarkdownIt();

export async function GET(context: APIContext): Promise<Response> {
	const blog = await getSortedPosts();

	return rss({
		title: siteConfig.title,
		description: "A personal blog and portfolio of Yuki Okushi.",
		site: context.site ?? "https://www.2k36.org",
		items: blog.map((post) => {
			const content = typeof post.body === "string" ? post.body : String(post.body || "");

			return {
				title: post.data.title,
				pubDate: post.data.published,
				description: post.data.description || "",
				link: `/posts/${post.id}/`,
				content: sanitizeHtml(parser.render(content), {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				}),
			};
		}),
		customData: `<language>${siteConfig.lang}</language>`,
	});
}
