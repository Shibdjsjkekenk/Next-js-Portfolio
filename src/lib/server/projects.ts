import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function getActiveProjects() {
  try {
    // Redis first
    const cached = await redis.get(CACHE_KEYS.PROJECT_ALL);
    if (cached) {
      return JSON.parse(cached);
    }

    // DB
    await connectDB();

    const projects = await Project.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean(); // IMPORTANT

    if (!projects.length) return [];

    // Cache
    await redis.set(
      CACHE_KEYS.PROJECT_ALL,
      JSON.stringify(projects),
      "EX",
      CACHE_TTL.MEDIUM,
    );

    return projects;
  } catch (e) {
    console.error("Projects fetch failed", e);
    return [];
  }
}
