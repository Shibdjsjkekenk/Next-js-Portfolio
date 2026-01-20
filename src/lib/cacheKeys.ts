//    Redis Cache Keys (Portfolio)

export const CACHE_KEYS = {
  // Banner

  BANNERS_ALL: "portfolio:banners:all",
  BANNER_BY_ID: (id: string) => `portfolio:banner:${id}`,

  ABOUT_ALL: "portfolio:about:all",
  ABOUT_BY_ID: (id: string) => `portfolio:about:${id}`,

  TIMELINE_ALL: "timeline:all",
  TIMELINE_BY_CATEGORY: (cat: string) => `timeline:category:${cat}`,
};
