import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AboutUs from "@/models/AboutUs";
import Document from "@/models/Document"; 
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { prepareAIFields } from "@/lib/ai/embeddingHelper"; 

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { content, image, resume, isActive } = await req.json();

    if (!content) {
      return NextResponse.json(
        { success: false, message: "Content is required" },
        { status: 400 }
      );
    }

    //  1. AI fields generate
    const { plainText, embedding } = await prepareAIFields(content);

    //  2. Save in AboutUs collection
    const about = await AboutUs.create({
      content,
      image: image || "",
      resume: resume || "",
      plainText,
      embedding,
      isActive: isActive ?? true,
    });

    //  3. Save in Document collection (VECTOR DB)
    await Document.create({
      type: "about",
      content,
      plainText,
      embedding,
      metadata: {
        aboutId: about._id, // link for update
      },
      isActive: isActive ?? true,
    });

    // cache clear
    await redis.del(CACHE_KEYS.ABOUT_ALL);

    return NextResponse.json({
      success: true,
      message: "About Us created successfully",
      data: about,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error creating About Us",
        error: error.message,
      },
      { status: 500 }
    );
  }
}