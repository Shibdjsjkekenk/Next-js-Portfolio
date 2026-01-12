//    Redis Cache Keys (Portfolio)

export const CACHE_KEYS = {

// Banner

  BANNERS_ALL: "portfolio:banners:all",
  BANNER_BY_ID: (id: string) => `portfolio:banner:${id}`,
};
