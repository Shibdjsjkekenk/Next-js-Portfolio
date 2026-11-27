import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Timeline from "@/models/Timeline";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    /* ================= REDIS CHECK ================= */
    const cached = await redis.get(
      CACHE_KEYS.TIMELINE_BY_ID(id)
    );

    if (cached) {
      return NextResponse.json({
        success: true,
        source: "redis",
        data: JSON.parse(cached),
      });
    }

    /* ================= DB FETCH ================= */
    await connectDB();

    const timeline = await Timeline.findById(id);

    if (!timeline) {
      return NextResponse.json(
        { success: false, message: "Timeline not found" },
        { status: 404 }
      );
    }

    /* ================= SET REDIS ================= */
    await redis.set(
      CACHE_KEYS.TIMELINE_BY_ID(id),
      JSON.stringify(timeline),
      "EX",
      CACHE_TTL.MEDIUM
    );

    return NextResponse.json({
      success: true,
      source: "db",
      data: timeline,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Fetch timeline by id failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
