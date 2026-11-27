import { connectDB } from "@/lib/db";
import AboutUs from "@/models/AboutUs";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function getAbout() {
  try {
  // Redis first
    const cached = await redis.get(CACHE_KEYS.ABOUT_ALL);
    if (cached) {
      const list = JSON.parse(cached);
      return list?.[0] ?? null;
    }

   // DB fallback
    await connectDB();

    const abouts = await AboutUs.find()
      .sort({ createdAt: -1 })
      .lean();

    if (!abouts.length) return null;

   // cache it
    await redis.set(
      CACHE_KEYS.ABOUT_ALL,
      JSON.stringify(abouts),
      "EX",
      CACHE_TTL.MEDIUM 
    );

    return abouts[0]; //  plain object now
  } catch (error) {
    console.error("❌ About fetch failed:", error);
    return null;
  }
}
