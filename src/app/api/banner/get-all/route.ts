import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function GET() {
  try {
    await connectDB();

    // 1. Always fetch from DB first
    const banners = await Banner.find().sort({ createdAt: -1 });

    // 2. If DB empty → clear cache
    if (!banners.length) {
      await redis.del(CACHE_KEYS.BANNERS_ALL);

      return NextResponse.json({
        success: true,
        source: "db-empty",
        data: [],
      });
    }

    // 3. Check Redis
    const cachedBanners = await redis.get(CACHE_KEYS.BANNERS_ALL);

    if (cachedBanners) {
      return NextResponse.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedBanners),
      });
    }

    // 4. Save fresh data
    await redis.set(
      CACHE_KEYS.BANNERS_ALL,
      JSON.stringify(banners),
      "EX",
      CACHE_TTL.SHORT
    );

    return NextResponse.json({
      success: true,
      source: "db",
      data: banners,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching Banners",
        error: error.message,
      },
      { status: 500 }
    );
  }
}