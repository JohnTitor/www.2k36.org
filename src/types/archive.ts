export type ArchivePost = {
	id: string;
	data: {
		title: string;
		tags: string[];
		category?: string | null;
		published: Date;
		zennPath?: string;
		emoji?: string;
		liked?: number;
		bookmarked?: number;
	};
};
