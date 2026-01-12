import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    //  IMPORTANT FIX
    const { id } = await context.params;

    const CACHE_KEY = CACHE_KEYS.BANNER_BY_ID(id);

    //  Redis check
    const cachedBanner = await redis.get(CACHE_KEY);
    if (cachedBanner) {
      return NextResponse.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedBanner),
      });
    }

    //  DB connect
    await connectDB();

    // MongoDB fetch
    const banner = await Banner.findById(id);
    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    //  Save to Redis
    await redis.set(CACHE_KEY, JSON.stringify(banner), "EX", CACHE_TTL.SHORT);

    return NextResponse.json({
      success: true,
      source: "db",
      data: banner,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching Banner",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
