import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Timeline from "@/models/Timeline";
import Document from "@/models/Document"; // 🔥 NEW
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { prepareAIFields } from "@/lib/ai/embeddingHelper";

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

    // 🔥 AI fields generate
    const { plainText, embedding } = await prepareAIFields(content);

    // ✅ Original Timeline save (same as before)
    const timeline = await Timeline.create({
      category,
      content,
      plainText,
      embedding,
      order: order ?? 0,
      isActive: isActive ?? true,
    });

    // 🔥 NEW: Save in Document collection (VECTOR DB)
    await Document.create({
      type: "timeline",
      content,
      plainText,
      embedding,
      metadata: {
        category,
        timelineId: timeline._id, // optional link
      },
      isActive: isActive ?? true,
    });

    // cache clear
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