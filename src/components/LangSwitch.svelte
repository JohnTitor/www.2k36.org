<script lang="ts">
import Icon from "@iconify/svelte";
import { getCurrentLocale, getLocalizedUrl } from "@utils/url-utils.ts";
import { onMount } from "svelte";

let { initialLocale = "ja" }: { initialLocale?: "ja" | "en" } = $props();
let locale = $state(initialLocale);

onMount(() => {
	const cur = getCurrentLocale(window.location.pathname);
	locale = cur === "en" ? "en" : "ja";
});

function getPathWithoutLocalePrefix(pathname: string): string {
	if (pathname === "/en") return "/";
	if (pathname.startsWith("/en/")) return pathname.slice(3);
	return pathname;
}

function switchLocale(newLocale: "ja" | "en") {
	locale = newLocale;
	const { pathname, search, hash } = window.location;
	const basePath = getPathWithoutLocalePrefix(pathname);
	const targetPath = getLocalizedUrl(basePath, newLocale);
	const destination = `${targetPath}${search}${hash}`;
	window.location.assign(destination);
}

function toggleLocale() {
	switchLocale(locale === "ja" ? "en" : "ja");
}

function showPanel() {
	const panel = document.querySelector("#lang-panel");
	if (panel) {
		panel.classList.remove("float-panel-closed");
	}
}

function hidePanel() {
	const panel = document.querySelector("#lang-panel");
	if (panel) {
		panel.classList.add("float-panel-closed");
	}
}
</script>

<div class="relative z-50" role="menu" tabindex="-1" onmouseleave={hidePanel}>
	<button aria-label="Language" role="menuitem" type="button" class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" id="lang-switch" onclick={toggleLocale} onmouseenter={showPanel}>
		<div class="absolute" class:opacity-0={locale !== "ja"}>
			<Icon icon="material-symbols:language-japanese-kana" class="text-[1.25rem]" />
		</div>
		<div class="absolute" class:opacity-0={locale !== "en"}>
			<Icon icon="material-symbols:language-us" class="text-[1.25rem]" />
		</div>
	</button>

	<div id="lang-panel" class="hidden lg:block absolute transition float-panel-closed top-11 -right-2 pt-5">
		<div class="card-base float-panel p-2">
			<button type="button" class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"
					class:current-theme-btn={locale === "ja"}
					onclick={() => switchLocale("ja")}
			>
				<Icon icon="material-symbols:language-japanese-kana" class="text-[1.25rem] mr-3" />
				日本語
			</button>
			<button type="button" class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95"
					class:current-theme-btn={locale === "en"}
					onclick={() => switchLocale("en")}
			>
				<Icon icon="material-symbols:language-us" class="text-[1.25rem] mr-3" />
				English
			</button>
		</div>
	</div>
</div>
