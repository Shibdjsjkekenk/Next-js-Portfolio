import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Timeline from "@/models/Timeline";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function GET() {
  try {
    await connectDB();

    const timelines = await Timeline.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    // 🔥 IMPORTANT: DB empty → cache clear
    if (!timelines.length) {
      await redis.del(CACHE_KEYS.TIMELINE_ALL);

      return NextResponse.json({
        success: true,
        source: "db-empty",
        data: [],
      });
    }

    // 🔥 cache update
    await redis.set(
      CACHE_KEYS.TIMELINE_ALL,
      JSON.stringify(timelines),
      "EX",
      CACHE_TTL.MEDIUM,
    );

    return NextResponse.json({
      success: true,
      source: "db",
      data: timelines,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Fetch failed", error: error.message },
      { status: 500 },
    );
  }
}
