import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AboutUs from "@/models/AboutUs";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function GET() {
  try {
    await connectDB();

    //  1. Always check DB first (important fix)
    const abouts = await AboutUs.find().sort({ createdAt: -1 });

    //  2. If DB is empty → clear cache and return empty
    if (!abouts.length) {
      await redis.del(CACHE_KEYS.ABOUT_ALL);

      return NextResponse.json({
        success: true,
        source: "db-empty",
        data: [],
      });
    }

    //  3. Check Redis cache
    const cached = await redis.get(CACHE_KEYS.ABOUT_ALL);

    if (cached) {
      return NextResponse.json({
        success: true,
        source: "redis",
        data: JSON.parse(cached),
      });
    }

    //  4. Save fresh data to Redis
    await redis.set(
      CACHE_KEYS.ABOUT_ALL,
      JSON.stringify(abouts),
      "EX",
      CACHE_TTL.MEDIUM
    );

    return NextResponse.json({
      success: true,
      source: "db",
      data: abouts,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching About Us",
        error: error.message,
      },
      { status: 500 }
    );
  }
}