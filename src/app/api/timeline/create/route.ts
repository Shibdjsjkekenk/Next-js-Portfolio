import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Timeline from "@/models/Timeline";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { category, content, order, isActive } = await req.json();

    if (!category || !content) {
      return NextResponse.json(
        { success: false, message: "Category and content are required" },
        { status: 400 }
      );
    }

    const timeline = await Timeline.create({
      category,
      content,
      order: order ?? 0,
      isActive: isActive ?? true,
      
    });

    await redis.del(CACHE_KEYS.TIMELINE_ALL);
    await redis.del(CACHE_KEYS.TIMELINE_BY_CATEGORY(category));

    return NextResponse.json({
      success: true,
      message: "Timeline created",
      data: timeline,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Create failed", error: error.message },
      { status: 500 }
    );
  }
}
