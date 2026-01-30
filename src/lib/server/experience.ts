import { connectDB } from "@/lib/db";
import Experience from "@/models/Experience";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function getActiveExperienceContent() {
  try {
    //  Redis first
    const cached = await redis.get(CACHE_KEYS.EXPERIENCE_ALL);
    if (cached) {
      return JSON.parse(cached);
    }

    await connectDB();

    const experiences = await Experience.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    if (!experiences.length) return [];

    await redis.set(
      CACHE_KEYS.EXPERIENCE_ALL,
      JSON.stringify(experiences),
      "EX",
      CACHE_TTL.MEDIUM
    );

    return experiences;
  } catch (err) {
    console.error("Experience fetch failed", err);
    return [];
  }
}
