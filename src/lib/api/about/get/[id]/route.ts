import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AboutUs from "@/models/AboutUs";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const key = CACHE_KEYS.ABOUT_BY_ID(id);

    const cached = await redis.get(key);
    if (cached) {
      return NextResponse.json({
        success: true,
        source: "redis",
        data: JSON.parse(cached),
      });
    }

    await connectDB();
    const about = await AboutUs.findById(id);

    if (!about) {
      return NextResponse.json(
        { success: false, message: "About Us not found" },
        { status: 404 }
      );
    }

    await redis.set(key, JSON.stringify(about), "EX", CACHE_TTL.MEDIUM);

    return NextResponse.json({
      success: true,
      source: "db",
      data: about,
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error fetching About Us", error: error.message },
      { status: 500 }
    );
  }
}
