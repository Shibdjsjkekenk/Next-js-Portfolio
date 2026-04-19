import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Timeline from "@/models/Timeline";
import Document from "@/models/Document"; // 🔥 NEW
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { revalidatePath } from "next/cache";
import { prepareAIFields } from "@/lib/ai/embeddingHelper";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await req.json();

    let updateData: any = { ...body };

    let plainText = "";
    let embedding: number[] = [];

    // 🔥 regenerate only if content changes
    if (body.content) {
      const { plainText: pt, embedding: emb } = await prepareAIFields(body.content);

      plainText = pt;
      embedding = emb as number[];
      updateData.plainText = plainText;
      updateData.embedding = embedding;
    }

    const timeline = await Timeline.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!timeline) {
      return NextResponse.json(
        { success: false, message: "Timeline not found" },
        { status: 404 }
      );
    }

    // 🔥 IMPORTANT: sync Document collection
    if (body.content) {
      await Document.findOneAndUpdate(
        {
          "metadata.timelineId": timeline._id,
          type: "timeline",
        },
        {
          content: timeline.content,
          plainText,
          embedding,
          isActive: timeline.isActive,
          metadata: {
            category: timeline.category,
            timelineId: timeline._id,
          },
        }
      );
    }

    // cache clear
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