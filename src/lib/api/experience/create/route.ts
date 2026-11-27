import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Experience from "@/models/Experience";
import Document from "@/models/Document";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { revalidatePath } from "next/cache";
import { prepareAIFields } from "@/lib/ai/embeddingHelper";

export async function POST(req: Request) {
  try {
    const { content, isActive = true } = await req.json();

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          message: "Content is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate AI fields
    const { plainText, embedding } = await prepareAIFields(content);

    // Save Experience
    const experience = await Experience.create({
      content,
      isActive,
    });

    // Save in Vector DB (Document Collection)
    await Document.create({
      type: "experience",
      content,
      plainText,
      embedding,
      metadata: {
        experienceId: experience._id,
      },
      isActive,
    });

    // Clear cache
    await redis.del(CACHE_KEYS.EXPERIENCE_ALL);

    // Revalidate pages
    revalidatePath("/");
    revalidatePath("/experience");

    return NextResponse.json(
      {
        success: true,
        message: "Experience content created successfully",
        data: experience,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Create failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}