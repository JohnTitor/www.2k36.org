<script lang="ts">
import { onMount } from "svelte";

import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import { getPostUrlById } from "../utils/url-utils";
import type { ArchivePost } from "../types/archive";

export let tags: string[] = [];
export let categories: string[] = [];
export let sortedPosts: ArchivePost[] = [];

let uncategorized: string | null = null;

interface Group {
	year: number;
	posts: ArchivePost[];
}

let groups: Group[] = [];

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}

function groupPosts(posts: ArchivePost[]): Group[] {
	const grouped = posts.reduce(
		(acc, post) => {
			const year = post.data.published.getFullYear();
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(post);
			return acc;
		},
		{} as Record<number, ArchivePost[]>,
	);

	const groupedPostsArray = Object.keys(grouped).map((yearStr) => ({
		year: Number.parseInt(yearStr, 10),
		posts: grouped[Number.parseInt(yearStr, 10)],
	}));

	groupedPostsArray.sort((a, b) => b.year - a.year);

	return groupedPostsArray;
}

groups = groupPosts(sortedPosts);

onMount(async () => {
	const params = new URLSearchParams(window.location.search);
	tags = params.has("tag") ? params.getAll("tag") : [];
	categories = params.has("category") ? params.getAll("category") : [];
	uncategorized = params.get("uncategorized");

	let filteredPosts: ArchivePost[] = sortedPosts;

	if (tags.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => tags.includes(tag)),
		);
	}

	if (categories.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) => post.data.category && categories.includes(post.data.category),
		);
	}

	if (uncategorized) {
		filteredPosts = filteredPosts.filter((post) => !post.data.category);
	}

	groups = groupPosts(filteredPosts);
});
</script>

<div class="card-base px-8 py-6">
    {#each groups as group}
        <div>
            <div class="flex flex-row w-full items-center h-[3.75rem]">
                <div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">
                    {group.year}
                </div>
                <div class="w-[15%] md:w-[10%]">
                    <div
                            class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto
                  -outline-offset-[2px] z-50 outline-3"
                    ></div>
                </div>
                <div class="w-[70%] md:w-[80%] transition text-left text-50">
                    {group.posts.length} {i18n(I18nKey.postsCount)}
                </div>
            </div>

            {#each group.posts as post}
                {#if post.data.category === "Zenn"}
                    <a
                        href={`https://zenn.dev${post.data.zennPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={post.data.title}
                        class="group btn-plain !block w-full rounded-lg hover:text-[initial] py-2"
                    >
                        <div class="flex flex-row justify-start items-start h-full">
                            <!-- date -->
                            <div class="w-[15%] md:w-[10%] transition text-sm text-right text-50 pt-1">
                                {formatDate(post.data.published)}
                            </div>
                            <!-- dot and line -->
                            <div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                                <span class="mx-auto text-xl">📝</span>
                            </div>
                            <!-- post title -->
                            <div
                                class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
                                group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)]
                                text-75 pr-8 overflow-hidden"
                            >
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium">Zenn</span>
                                    <span class="break-words">{post.data.title}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 text-sm flex-shrink-0">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                        <polyline points="15,3 21,3 21,9"/>
                                        <line x1="10" y1="14" x2="21" y2="3"/>
                                    </svg>
                                </div>
                            </div>
                            <!-- Zenn icon, likes, bookmarks -->
                            <div class="hidden md:block md:w-[15%] text-left text-sm transition whitespace-nowrap overflow-ellipsis overflow-hidden text-30 pt-1">
                                <span title="Likes">❤️ {post.data.liked}</span> <span title="Bookmarks">🔖 {post.data.bookmarked}</span>
                            </div>
                        </div>
                    </a>
                {:else}
                    <a
                        href={getPostUrlById(post.id)}
                        aria-label={post.data.title}
                        class="group btn-plain !block w-full rounded-lg hover:text-[initial] py-2"
                    >
                        <div class="flex flex-row justify-start items-start h-full">
                            <!-- date -->
                            <div class="w-[15%] md:w-[10%] transition text-sm text-right text-50 pt-1">
                                {formatDate(post.data.published)}
                            </div>
                            <!-- dot and line -->
                            <div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                                <div
                                    class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                                    bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)]
                                    outline outline-4 z-50
                                    outline-[var(--card-bg)]
                                    group-hover:outline-[var(--btn-plain-bg-hover)]
                                    group-active:outline-[var(--btn-plain-bg-active)]"
                                ></div>
                            </div>
                            <!-- post title -->
                            <div
                                class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
                                group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)]
                                text-75 pr-8 overflow-hidden"
                            >
                                {post.data.title}
                            </div>
                            <!-- tag list -->
                            <div class="hidden md:block md:w-[15%] text-left text-sm transition whitespace-nowrap overflow-ellipsis overflow-hidden text-30 pt-1">
                                {formatTag(post.data.tags)}
                            </div>
                        </div>
                    </a>
                {/if}
            {/each}
        </div>
    {/each}
</div>
