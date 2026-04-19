import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AboutUs from "@/models/AboutUs";
import Document from "@/models/Document"; // 🔥 NEW
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { revalidatePath } from "next/cache";
import { prepareAIFields } from "@/lib/ai/embeddingHelper"; // 🔥 NEW

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    let updateData: any = { ...body };

    let plainText = "";
    let embedding: number[] = [];

    // 🔥 regenerate only if content changed
    if (body.content) {
      const aiData = await prepareAIFields(body.content);

      plainText = aiData.plainText;
      embedding = aiData.embedding as number[];

      updateData.plainText = plainText;
      updateData.embedding = embedding;
    }

    // ✅ update AboutUs collection
    const about = await AboutUs.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!about) {
      return NextResponse.json(
        { success: false, message: "About Us not found" },
        { status: 404 },
      );
    }

    // 🔥 IMPORTANT: sync Document collection
    if (body.content) {
      await Document.findOneAndUpdate(
        {
          "metadata.aboutId": about._id,
          type: "about",
        },
        {
          content: about.content,
          plainText,
          embedding,
          isActive: about.isActive,
          metadata: {
            aboutId: about._id,
          },
        }
      );
    }

    // cache clear
    await redis.del(CACHE_KEYS.ABOUT_ALL);
    await redis.del(CACHE_KEYS.ABOUT_BY_ID(id));

    revalidatePath("/");
    revalidatePath("/about");

    return NextResponse.json({
      success: true,
      message: "About Us updated successfully",
      data: about,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating About Us",
        error: error.message,
      },
      { status: 500 },
    );
  }
}