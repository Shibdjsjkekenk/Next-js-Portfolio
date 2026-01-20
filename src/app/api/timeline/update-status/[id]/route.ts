import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Timeline from "@/models/Timeline";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // DB connect
    await connectDB();

    // MUST await params
    const { id } = await context.params;

    const { isActive } = await req.json();

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, message: "isActive must be boolean" },
        { status: 400 }
      );
    }

    const timeline = await Timeline.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!timeline) {
      return NextResponse.json(
        { success: false, message: "Timeline not found" },
        { status: 404 }
      );
    }

    //  CLEAR REDIS CACHE
    await redis.del(CACHE_KEYS.TIMELINE_ALL);
    await redis.del(CACHE_KEYS.TIMELINE_BY_CATEGORY(timeline.category));

    //  REVALIDATE SSR PAGES
    revalidatePath("/");
    revalidatePath("/timeline");

    return NextResponse.json({
      success: true,
      message: `Timeline ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      data: timeline,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating timeline status",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
