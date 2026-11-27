import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Timeline from "@/models/Timeline";
import Document from "@/models/Document";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const timeline = await Timeline.findByIdAndDelete(id);

    if (!timeline) {
      return NextResponse.json(
        { success: false, message: "Timeline not found" },
        { status: 404 }
      );
    }

    //  delete from Document (vector DB)
    await Document.findOneAndDelete({
      "metadata.timelineId": timeline._id,
      type: "timeline",
    });

    // cache clear
    await redis.del(CACHE_KEYS.TIMELINE_ALL);
    await redis.del(CACHE_KEYS.TIMELINE_BY_CATEGORY(timeline.category));

    revalidatePath("/");
    revalidatePath("/timeline");

    return NextResponse.json({
      success: true,
      message: "Timeline deleted",
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Delete failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}