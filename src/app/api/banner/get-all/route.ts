import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function GET() {
  try {
    //  Redis check
    const cachedBanners = await redis.get(CACHE_KEYS.BANNERS_ALL);
    if (cachedBanners) {
      return NextResponse.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedBanners),
      });
    }

    //  DB connect
    await connectDB();

    //  MongoDB fetch
    const banners = await Banner.find().sort({ createdAt: -1 });

    //  Save to Redis
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
