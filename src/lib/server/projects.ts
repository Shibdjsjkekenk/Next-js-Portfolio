export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function getActiveProjects() {
  try {
    // Use ACTIVE cache key (IMPORTANT)
    const cached = await redis.get(CACHE_KEYS.PROJECT_ACTIVE);

    if (cached) {
      // console.log("REDIS ACTIVE HIT");
      return JSON.parse(cached);
    }

    console.log("DB ACTIVE HIT");

    await connectDB();

    const projects = await Project.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    if (!projects.length) return [];

    // Cache ACTIVE projects separately
    await redis.set(
      CACHE_KEYS.PROJECT_ACTIVE,
      JSON.stringify(projects),
      "EX",
      CACHE_TTL.MEDIUM
    );

    return projects;
  } catch (e) {
    console.error("Active projects fetch failed", e);
    return [];
  }
}