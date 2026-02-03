import { type CollectionEntry, getCollection } from "astro:content";
import { fileURLToPath } from "node:url";
import { createCanvas, GlobalFonts, type SKRSContext2D } from "@napi-rs/canvas";
import type { APIRoute, GetStaticPaths } from "astro";
import { siteConfig } from "@/config";
import { formatDateToYYYYMMDD } from "@/utils/date-utils";

export const prerender = true;

const WIDTH = 1200;
const HEIGHT = 630;
const PADDING_X = 96;
const TITLE_MAX_LINES = 3;
const TITLE_MAX_SIZE = 72;
const TITLE_MIN_SIZE = 44;
const TITLE_LINE_HEIGHT = 1.25;
const FONT_FAMILY = "IPAGothic";

const fontPath = fileURLToPath(new URL("../../assets/og/fonts/ipag.ttf", import.meta.url));
GlobalFonts.registerFromPath(fontPath, FONT_FAMILY);

function normalizeTitle(title: string): string {
	return title.replace(/\s+/g, " ").trim();
}

function splitTokens(text: string): { tokens: string[]; joiner: string } {
	const normalized = normalizeTitle(text);
	if (!normalized) return { tokens: [], joiner: "" };
	if (/\s/.test(normalized)) {
		return { tokens: normalized.split(" "), joiner: " " };
	}
	return { tokens: Array.from(normalized), joiner: "" };
}

function breakToken(ctx: SKRSContext2D, token: string, maxWidth: number): string[] {
	const chars = Array.from(token);
	const parts: string[] = [];
	let current = "";
	for (const char of chars) {
		const test = current + char;
		if (ctx.measureText(test).width <= maxWidth) {
			current = test;
			continue;
		}
		if (current) {
			parts.push(current);
			current = char;
		} else {
			parts.push(char);
			current = "";
		}
	}
	if (current) parts.push(current);
	return parts;
}

function buildLines(ctx: SKRSContext2D, text: string, maxWidth: number): string[] {
	const { tokens, joiner } = splitTokens(text);
	if (tokens.length === 0) return [];
	const lines: string[] = [];
	let current = "";

	for (const token of tokens) {
		const tokenWidth = ctx.measureText(token).width;
		const next = current ? `${current}${joiner}${token}` : token;
		if (tokenWidth > maxWidth) {
			if (current) {
				lines.push(current);
				current = "";
			}
			const parts = breakToken(ctx, token, maxWidth);
			if (parts.length > 1) {
				lines.push(...parts.slice(0, -1));
				current = parts[parts.length - 1] ?? "";
			} else if (parts.length === 1) {
				lines.push(parts[0]);
				current = "";
			}
			continue;
		}
		if (ctx.measureText(next).width <= maxWidth) {
			current = next;
			continue;
		}

		lines.push(current);
		current = token;
	}

	if (current) lines.push(current);
	return lines;
}

function clampLines(
	ctx: SKRSContext2D,
	lines: string[],
	maxWidth: number,
	maxLines: number,
): string[] {
	const clamped = lines.slice(0, maxLines);
	const suffix = "...";
	let last = clamped[maxLines - 1] ?? "";
	while (last && ctx.measureText(`${last}${suffix}`).width > maxWidth) {
		const chars = Array.from(last);
		chars.pop();
		last = chars.join("");
	}
	clamped[maxLines - 1] = last ? `${last}${suffix}` : suffix;
	return clamped;
}

function layoutTitle(
	ctx: SKRSContext2D,
	title: string,
	maxWidth: number,
): { lines: string[]; fontSize: number } {
	let fontSize = TITLE_MAX_SIZE;
	let lines: string[] = [];
	while (fontSize >= TITLE_MIN_SIZE) {
		ctx.font = `700 ${fontSize}px ${FONT_FAMILY}`;
		lines = buildLines(ctx, title, maxWidth);
		if (lines.length <= TITLE_MAX_LINES) break;
		fontSize -= 4;
	}
	if (lines.length > TITLE_MAX_LINES) {
		lines = clampLines(ctx, lines, maxWidth, TITLE_MAX_LINES);
	}
	return { lines, fontSize };
}

function drawBackground(ctx: SKRSContext2D): void {
	const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
	gradient.addColorStop(0, "#0b1120");
	gradient.addColorStop(1, "#0f172a");
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, WIDTH, HEIGHT);

	const glow = ctx.createRadialGradient(
		WIDTH * 0.85,
		-HEIGHT * 0.2,
		20,
		WIDTH * 0.85,
		-HEIGHT * 0.2,
		WIDTH * 0.75,
	);
	glow.addColorStop(0, "rgba(45, 212, 191, 0.35)");
	glow.addColorStop(1, "rgba(45, 212, 191, 0)");
	ctx.fillStyle = glow;
	ctx.fillRect(0, 0, WIDTH, HEIGHT);

	const accentGradient = ctx.createLinearGradient(0, 120, 0, 520);
	accentGradient.addColorStop(0, "#22d3ee");
	accentGradient.addColorStop(1, "#38bdf8");
	ctx.fillStyle = accentGradient;
	ctx.fillRect(PADDING_X - 20, 120, 6, 400);
}

function drawMeta(ctx: SKRSContext2D, published: string): void {
	ctx.fillStyle = "#94a3b8";
	ctx.font = `600 26px ${FONT_FAMILY}`;
	ctx.fillText(siteConfig.title, PADDING_X, 96);
	if (published) {
		ctx.fillText(published, PADDING_X, 560);
	}
}

function drawTitle(ctx: SKRSContext2D, title: string): void {
	const maxWidth = WIDTH - PADDING_X * 2;
	const { lines, fontSize } = layoutTitle(ctx, title, maxWidth);
	ctx.font = `700 ${fontSize}px ${FONT_FAMILY}`;
	ctx.fillStyle = "#f8fafc";
	const lineHeight = Math.round(fontSize * TITLE_LINE_HEIGHT);
	const startY = 190;
	lines.forEach((line, index) => {
		ctx.fillText(line, PADDING_X, startY + index * lineHeight);
	});
}

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	return posts.map((entry) => ({
		params: { slug: entry.id },
		props: { entry },
	}));
};

export const GET: APIRoute = async ({ params, props }) => {
	let entry = props?.entry as CollectionEntry<"posts"> | undefined;
	if (!entry) {
		const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
		if (slug) {
			const posts = await getCollection("posts", ({ data }) => {
				return import.meta.env.PROD ? data.draft !== true : true;
			});
			entry = posts.find((post) => post.id === slug);
		}
	}
	if (!entry) {
		return new Response("Not found", { status: 404 });
	}

	const title = normalizeTitle(entry.data.title) || siteConfig.title;
	const published = entry.data.published ? formatDateToYYYYMMDD(entry.data.published) : "";

	const canvas = createCanvas(WIDTH, HEIGHT);
	const ctx = canvas.getContext("2d");
	ctx.textBaseline = "top";

	drawBackground(ctx);
	drawMeta(ctx, published);
	drawTitle(ctx, title);

	const buffer = canvas.toBuffer("image/png");
	return new Response(new Uint8Array(buffer), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
};
