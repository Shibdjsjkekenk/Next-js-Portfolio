import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Timeline from "@/models/Timeline";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function GET() {
  try {
    /*  CHECK REDIS */
    const cached = await redis.get(CACHE_KEYS.TIMELINE_ALL);
    if (cached) {
      return NextResponse.json({
        success: true,
        source: "redis",
        data: JSON.parse(cached),
      });
    }

    /* DB FETCH */
    await connectDB();

    const timelines = await Timeline.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });

    /* SET REDIS WITH TTL */
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
      {
        success: false,
        message: "Fetch failed",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
