import type { PageContentBlock } from "../../emdash-env";

type HeroBlock = Extract<PageContentBlock, { _type: "marketing_hero" }>;


/**
 * Fallbacks for `getSeoMeta()` from the page's first hero, used when the
 * page's SEO panel is empty: its subheadline describes the page and its photo
 * is the share image.
 */
export function heroSeoDefaults(blocks: PageContentBlock[] | undefined, origin: string) {
	const hero = blocks?.find((block): block is HeroBlock => block._type === "marketing_hero");
	return {
		defaultDescription: hero?.subheadline?.trim() || undefined,
		defaultOgImage: `${origin}/og-gent-ford.jpg`,
	};
}
