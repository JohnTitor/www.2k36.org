import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const postsCollection: ReturnType<typeof defineCollection> = defineCollection({
	loader: glob({
		pattern: "**/*.md",
		base: "src/content/posts",
	}),
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		ogImage: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const specCollection: ReturnType<typeof defineCollection> = defineCollection({
	loader: glob({
		pattern: "**/*.md",
		base: "src/content/spec",
	}),
	schema: z.object({}),
});
export const collections: Record<
	string,
	ReturnType<typeof defineCollection>
> = {
	posts: postsCollection,
	spec: specCollection,
};
