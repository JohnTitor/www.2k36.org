import type {
	ExpressiveCodeConfig,
	GiscusConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "2k36",
	lang: "ja",
	themeColor: {
		hue: 270,
		fixed: true,
	},
	toc: {
		enable: true,
		depth: 2,
	},
	favicon: [],
};

export const navBarConfig: NavBarConfig = {
	links: [LinkPreset.Home, LinkPreset.Archive, LinkPreset.About, LinkPreset.Sponsors],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.webp",
	name: "Yuki Okushi",
	bio: "Japanese codewriting ninja",
	links: [
		{
			name: "GitHub",
			icon: "line-md:github-loop",
			url: "https://github.com/JohnTitor",
		},
		{
			name: "Bluesky",
			icon: "line-md:bluesky",
			url: "https://bsky.app/profile/2k36.org",
		},
		{
			name: "LinkedIn",
			icon: "line-md:linkedin",
			url: "https://www.linkedin.com/in/jtitor/",
		},
		{
			name: "Email",
			icon: "line-md:email",
			url: "mailto:huyuumi.dev@gmail.com",
		},
	],
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};

export const giscusConfig: GiscusConfig = {
	repo: "JohnTitor/authority",
	repoId: "R_kgDOK1-0Eg",
	category: "Announcements",
	categoryId: "DIC_kwDOK1-0Es4CrgZf",
	mapping: "title",
	reactionsEnabled: true,
	inputPosition: "top",
	lang: "ja",
	theme: "preferred_color_scheme",
};
