#!/usr/bin/env node

import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ZENN_USERNAME = "fraternite";
const ZENN_API_URL = `https://zenn.dev/api/articles?username=${ZENN_USERNAME}`;
const OUTPUT_PATH = path.join(__dirname, "../src/data/zenn-articles.json");

async function fetchZennArticles() {
	try {
		console.log(`📡 Fetching Zenn articles for: ${ZENN_USERNAME}`);

		const response = await fetch(ZENN_API_URL);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		if (!data.articles || !Array.isArray(data.articles)) {
			throw new Error("Invalid response format: articles array not found");
		}

		console.log(`✅ Retrieved ${data.articles.length} articles`);

		// Sort by date (newest first)
		data.articles.sort(
			(a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
		);

		// Create output directory if it doesn't exist
		const outputDir = path.dirname(OUTPUT_PATH);
		await fs.mkdir(outputDir, { recursive: true });

		// Save to JSON file
		await fs.writeFile(OUTPUT_PATH, JSON.stringify(data, null, 2), "utf8");

		console.log(`💾 Article data saved to: ${OUTPUT_PATH}`);

		// Display latest article information
		if (data.articles.length > 0) {
			const latest = data.articles[0];
			console.log(
				`📝 Latest article: "${latest.title}" (${new Date(latest.published_at).toLocaleDateString("ja-JP")})`,
			);
		}
	} catch (error) {
		console.error("❌ Error occurred:", error.message);
		process.exit(1);
	}
}

// Execute script
fetchZennArticles();
