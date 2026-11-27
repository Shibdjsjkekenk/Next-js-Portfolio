import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function getActiveBanner() {
  try {
    // ✅ REDIS CHECK
    const cached = await redis.get(CACHE_KEYS.BANNERS_ALL);

    if (cached) {
      const list = JSON.parse(cached);

      // ❌ REMOVE fallback
      const activeBanner = list.find((b: any) => b.isActive === true);

      return activeBanner || null; // ✅ ONLY active
    }

    // ✅ DB CALL
    await connectDB();

    const banners = await Banner.find()
      .sort({ createdAt: -1 })
      .lean();

    if (!banners.length) return null;

    // ✅ CACHE STORE
    await redis.set(
      CACHE_KEYS.BANNERS_ALL,
      JSON.stringify(banners),
      "EX",
      CACHE_TTL.MEDIUM
    );

    // ❌ REMOVE fallback
    const activeBanner = banners.find((b) => b.isActive === true);

    return activeBanner || null; // ✅ ONLY active
  } catch (e) {
    console.error("Hero fetch failed", e);
    return null;
  }
}