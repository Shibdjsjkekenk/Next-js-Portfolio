import { connectDB } from "@/lib/db";
import Timeline from "@/models/Timeline";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function getActiveTimelines() {
  try {
    await connectDB();

    const timelines = await Timeline.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    if (!timelines.length) {
      await redis.del(CACHE_KEYS.TIMELINE_ALL);
      return [];
    }

    // 🔥 ALWAYS update cache (not only read)
    await redis.set(
      CACHE_KEYS.TIMELINE_ALL,
      JSON.stringify(timelines),
      "EX",
      CACHE_TTL.MEDIUM,
    );

    return timelines;
  } catch (e) {
    console.error("Timeline fetch failed", e);
    return [];
  }
}
