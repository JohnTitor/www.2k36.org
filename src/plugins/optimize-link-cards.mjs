import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

/** Optimize generated thumbnails without modifying remark-link-card-plus's cache. */
export function optimizeLinkCards() {
	return {
		name: "optimize-link-cards",
		hooks: {
			"astro:build:done": async ({ dir }) => {
				const output = fileURLToPath(dir);
				const files = await readdir(output, { recursive: true });
				const images = new Map();
				for (const file of files.filter((file) => file.endsWith(".html"))) {
					const filename = path.join(output, file);
					const html = await readFile(filename, "utf8");
					const sources = [
						...html.matchAll(/\/remark-link-card-plus\/[\w-]+\.(?:png|jpe?g|webp)/g),
					];
					for (const [source] of sources) {
						if (images.has(source)) continue;
						const target = source.replace(/\.[^.]+$/, ".webp");
						const image = await sharp(path.join(output, source))
							.resize({ width: 400, withoutEnlargement: true })
							.webp({ quality: 80 })
							.toBuffer();
						await writeFile(path.join(output, target), image);
						images.set(source, target);
					}
					if (sources.length) {
						const optimized = html.replace(
							/\/remark-link-card-plus\/[\w-]+\.(?:png|jpe?g|webp)/g,
							(source) => images.get(source),
						);
						await writeFile(filename, optimized);
					}
				}
				const used = new Set([...images.values()].map((source) => source.slice(1)));
				for (const file of files.filter((file) => file.startsWith("remark-link-card-plus/"))) {
					if (!used.has(file)) await rm(path.join(output, file));
				}
			},
		},
	};
}
