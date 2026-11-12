import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
	return new Response(
		JSON.stringify({
			linkset: [
				{
					anchor: new URL("rss.xml", site).href,
					"service-desc": [
						{
							href: new URL("api/openapi.json", site).href,
							type: "application/json",
						},
					],
					"service-doc": [
						{
							href: new URL("docs/api/", site).href,
							type: "text/html",
							hreflang: ["ja"],
						},
						{
							href: new URL("en/docs/api/", site).href,
							type: "text/html",
							hreflang: ["en"],
						},
					],
					status: [
						{
							href: new URL("api/status.json", site).href,
							type: "application/json",
						},
					],
				},
			],
		}),
		{
			headers: {
				"Content-Type":
					'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
				Link: '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
			},
		},
	);
};
