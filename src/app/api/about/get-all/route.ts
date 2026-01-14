import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AboutUs from "@/models/AboutUs";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function GET() {
  try {
    const cached = await redis.get(CACHE_KEYS.ABOUT_ALL);
    if (cached) {
      return NextResponse.json({
        success: true,
        source: "redis",
        data: JSON.parse(cached),
      });
    }

    await connectDB();
    const abouts = await AboutUs.find().sort({ createdAt: -1 });

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
      { success: false, message: "Error fetching About Us", error: error.message },
      { status: 500 }
    );
  }
}
