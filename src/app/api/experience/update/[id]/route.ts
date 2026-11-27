import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Experience from "@/models/Experience";
import Document from "@/models/Document";
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

    // Regenerate embedding only if content changed
    if (body.content) {
      const aiData = await prepareAIFields(body.content);

      plainText = aiData.plainText;
      embedding = aiData.embedding as number[];

      updateData.plainText = plainText;
      updateData.embedding = embedding;
    }

    // Update Experience collection
    const experience = await Experience.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!experience) {
      return NextResponse.json(
        {
          success: false,
          message: "Experience not found",
        },
        { status: 404 }
      );
    }

    // Sync Document collection
    if (body.content) {
      await Document.findOneAndUpdate(
        {
          "metadata.experienceId": experience._id,
          type: "experience",
        },
        {
          content: experience.content,
          plainText,
          embedding,
          isActive: experience.isActive,
          metadata: {
            experienceId: experience._id,
          },
        }
      );
    }

    // Cache clear
    await redis.del(CACHE_KEYS.EXPERIENCE_ALL);
    await redis.del(CACHE_KEYS.EXPERIENCE_BY_ID(id));

    // Revalidate
    revalidatePath("/");
    revalidatePath("/experience");

    return NextResponse.json({
      success: true,
      message: "Experience updated successfully",
      data: experience,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Update failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}