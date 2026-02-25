// Redis Cache Keys (Portfolio)

export const CACHE_KEYS = {

  BANNERS_ALL: "portfolio:banners:all",
  BANNER_BY_ID: (id: string) => `portfolio:banner:${id}`,

  ABOUT_ALL: "portfolio:about:all",
  ABOUT_BY_ID: (id: string) => `portfolio:about:${id}`,

  TIMELINE_ALL: "timeline:all",
  TIMELINE_BY_ID: (id: string) => `timeline:${id}`,
  TIMELINE_BY_CATEGORY: (cat: string) => `timeline:category:${cat}`,

  PROJECT_ALL: "portfolio:projects:all",
  PROJECT_ACTIVE: "portfolio:projects:active",
  PROJECT_BY_ID: (id: string) => `portfolio:project:${id}`,

  EXPERIENCE_ALL: "portfolio:experience:all",
  EXPERIENCE_BY_ID: (id: string) => `portfolio:experience:${id}`,
};