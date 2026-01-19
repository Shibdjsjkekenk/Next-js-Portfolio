import { connectDB } from "@/lib/db";
import AboutUs from "@/models/AboutUs";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";

export async function getAbout() {
  try {
    /* ---------- 1️⃣ REDIS FIRST ---------- */
    const cached = await redis.get(CACHE_KEYS.ABOUT_ALL);
    if (cached) {
      const list = JSON.parse(cached);
      return list?.[0] ?? null;
    }

    /* ---------- 2️⃣ DB FALLBACK ---------- */
    await connectDB();
    const abouts = await AboutUs.find().sort({ createdAt: -1 });

    if (!abouts.length) return null;

    /* ---------- 3️⃣ CACHE IT ---------- */
    await redis.set(
      CACHE_KEYS.ABOUT_ALL,
      JSON.stringify(abouts),
      "EX",
      60 * 10 // 10 min (adjust if needed)
    );

    return abouts[0];
  } catch (error) {
    console.error("❌ About fetch failed:", error);
    return null;
  }
}
