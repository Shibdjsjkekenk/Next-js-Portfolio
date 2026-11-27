
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export const runtime = "nodejs";

export async function GET() {
  try {
    const CACHE_KEY = CACHE_KEYS.BANNERS_ALL;

    try {
      const cachedBanners = await redis.get(CACHE_KEY);

      if (cachedBanners) {
        return NextResponse.json({
          success: true,
          source: "redis",
          data: JSON.parse(cachedBanners),
        });
      }
    } catch {}

    await connectDB();

    const banners = await Banner.find()
      .sort({ createdAt: -1 })
      .lean();

    if (!banners.length) {
      return NextResponse.json({
        success: true,
        source: "db",
        data: [],
      });
    }

    try {
      await redis.set(
        CACHE_KEY,
        JSON.stringify(banners),
        "EX",
        CACHE_TTL.SHORT,
      );
    } catch {}

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
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
