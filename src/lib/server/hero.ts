import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function getActiveBanner() {
  try {
    //  Redis
    const cached = await redis.get(CACHE_KEYS.BANNERS_ALL);
    if (cached) {
      const list = JSON.parse(cached);
      return list.find((b: any) => b.isActive) ?? list[0] ?? null;
    }

    //  DB
    await connectDB();
    const banners = await Banner.find().sort({ createdAt: -1 }).lean(); // THIS IS THE KEY

    if (!banners.length) return null;

    //  Cache
    await redis.set(
      CACHE_KEYS.BANNERS_ALL,
      JSON.stringify(banners),
      "EX",
      CACHE_TTL.MEDIUM,
    );

    return banners.find((b) => b.isActive) ?? banners[0];
  } catch (e) {
    console.error("Hero fetch failed", e);
    return null;
  }
}
