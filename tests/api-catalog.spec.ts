import { expect, test } from "@playwright/test";

test("API catalog links to reachable endpoints and matching documentation", async ({ request }) => {
	const response = await request.get("/.well-known/api-catalog");
	expect(response.status()).toBe(200);
	const { linkset } = await response.json();
	expect(Array.isArray(linkset)).toBe(true);
	expect(linkset.length).toBeGreaterThan(0);

	for (const entry of linkset) {
		const anchor = new URL(entry.anchor);
		expect(anchor.protocol).toBe("https:");
		const api = await request.get(anchor.pathname);
		expect(api.status()).toBe(200);
		expect(await api.text()).toContain('<rss version="2.0"');

		for (const relation of ["service-desc", "service-doc", "status"]) {
			expect(Array.isArray(entry[relation])).toBe(true);
			expect(entry[relation].length).toBeGreaterThan(0);
			for (const link of entry[relation]) {
				const target = new URL(link.href);
				expect(target.origin).toBe(anchor.origin);
				const resource = await request.get(target.pathname);
				expect(resource.status(), link.href).toBe(200);
				expect(resource.headers()["content-type"]).toContain(link.type);
			}
		}

		const description = await request.get(new URL(entry["service-desc"][0].href).pathname);
		const specification = await description.json();
		expect(specification.openapi).toMatch(/^3\./);
		expect(specification.servers.map(({ url }: { url: string }) => new URL(url).origin)).toContain(
			anchor.origin,
		);
		expect(specification.externalDocs.url).toBe(entry["service-doc"][0].href);
		expect(specification.paths[anchor.pathname].get.responses["200"]).toBeDefined();

		const statusUrl = new URL(entry.status[0].href);
		expect(specification.paths[statusUrl.pathname].get).toBeDefined();
		const status = await request.get(statusUrl.pathname);
		expect(await status.json()).toEqual({ status: "ok" });
	}
});
