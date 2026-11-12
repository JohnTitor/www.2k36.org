import type { APIRoute } from "astro";

const robotsTxt = `
User-agent: *
Content-Signal: ai-train=no, search=yes, ai-input=no
Disallow: /_astro/

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
