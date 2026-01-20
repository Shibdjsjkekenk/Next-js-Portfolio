import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Timeline from "@/models/Timeline";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { revalidatePath } from "next/cache";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await req.json();

    const timeline = await Timeline.findByIdAndUpdate(id, body, { new: true });

    if (!timeline) {
      return NextResponse.json(
        { success: false, message: "Timeline not found" },
        { status: 404 }
      );
    }

    await redis.del(CACHE_KEYS.TIMELINE_ALL);
    await redis.del(CACHE_KEYS.TIMELINE_BY_CATEGORY(timeline.category));

    revalidatePath("/");
    revalidatePath("/timeline");

    return NextResponse.json({
      success: true,
      message: "Timeline updated",
      data: timeline,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Update failed", error: error.message },
      { status: 500 }
    );
  }
}
