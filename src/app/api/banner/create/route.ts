import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import Document from "@/models/Document";
import { prepareAIFields } from "@/lib/ai/embeddingHelper";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { title, paragraph, italicTitle, image, isActive } = await req.json();

    if (!title || !paragraph) {
      return NextResponse.json(
        { success: false, message: "Title and Paragraph are required" },
        { status: 400 }
      );
    }

    //  1. Combine text for AI
    const combinedText = `${title} ${paragraph} ${italicTitle || ""}`.trim();

    //  2. Generate plainText + embedding
    const { plainText, embedding } = await prepareAIFields(combinedText);

    //  3. Save in Banner collection
    const banner = await Banner.create({
      title,
      paragraph,
      italicTitle: italicTitle || "",
      image,
      plainText,
      embedding,
      isActive: isActive !== undefined ? isActive : true,
    });

    //  4. Save in Document collection (VECTOR DB)
    await Document.create({
      type: "banner",
      content: combinedText,
      plainText,
      embedding,
      metadata: {
        bannerId: banner._id,
      },
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Banner created successfully",
        data: banner,
      },
      { status: 201 }
    );

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error creating Banner",
        error: error.message,
      },
      { status: 500 }
    );
  }
}