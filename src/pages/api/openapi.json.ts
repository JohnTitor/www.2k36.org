import type { APIRoute } from "astro";
import { siteConfig } from "@/config";

export const GET: APIRoute = ({ site }) => {
	return Response.json({
		openapi: "3.2.1",
		info: {
			title: `${siteConfig.title} RSS API`,
			version: "1.0.0",
			description: "Read-only access to published Japanese blog posts through an RSS 2.0 feed.",
		},
		servers: [{ url: new URL("/", site).href }],
		externalDocs: { url: new URL("docs/api/", site).href },
		security: [],
		paths: {
			"/rss.xml": {
				get: {
					operationId: "getRssFeed",
					summary: "Get published Japanese blog posts",
					description:
						"Returns posts in descending publication date order, including their titles, URLs, publication dates, descriptions, and HTML content. The feed is updated when the site is built and deployed. No query parameters are required.",
					responses: {
						"200": {
							description: "An RSS 2.0 XML document.",
							content: {
								"application/xml": { schema: { type: "string" } },
							},
						},
					},
				},
			},
			"/api/status.json": {
				get: {
					operationId: "getStatus",
					summary: "Check static site availability",
					description:
						"A static availability marker served with the site. Check /rss.xml separately for feed availability and freshness.",
					responses: {
						"200": {
							description: "The static status resource is reachable.",
							content: {
								"application/json": {
									schema: {
										type: "object",
										required: ["status"],
										properties: { status: { type: "string", const: "ok" } },
										additionalProperties: false,
									},
									example: { status: "ok" },
								},
							},
						},
					},
				},
			},
		},
	});
};
