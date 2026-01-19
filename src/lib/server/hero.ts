import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";

export async function getActiveBanner() {
  try {
    // Redis first
    const cached = await redis.get(CACHE_KEYS.BANNERS_ALL);
    if (cached) {
      const list = JSON.parse(cached);
      return list.find((b: any) => b.isActive) ?? list[0] ?? null;
    }

    //  DB fallback
    await connectDB();
    const banners = await Banner.find().sort({ createdAt: -1 });

    if (!banners.length) return null;

    return banners.find(b => b.isActive) ?? banners[0];
  } catch (e) {
    console.error("Hero fetch failed", e);
    return null;
  }
}
