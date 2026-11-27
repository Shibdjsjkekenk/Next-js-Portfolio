
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import Document from "@/models/Document";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { prepareAIFields } from "@/lib/ai/embeddingHelper";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let publicId = "";
  let bannerCreated = false;
  const warnings: string[] = [];

  try {
    await connectDB();

    const { title, paragraph, italicTitle, image, isActive } =
      await req.json();

    if (!title || !paragraph) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and Paragraph are required",
        },
        { status: 400 },
      );
    }

    let imageUrl = "";

    if (image) {
      const uploaded = await cloudinary.uploader.upload(image, {
        folder: "Personal-Portfolio",
      });

      imageUrl = uploaded.secure_url;
      publicId = uploaded.public_id;
    }

    const combinedText = `${title} ${paragraph} ${italicTitle || ""}`.trim();
    const active = isActive ?? true;

    let plainText = "";
    let embedding: number[] = [];
    let embeddingGenerated = false;

    try {
      const aiData = await prepareAIFields(combinedText);

      plainText = aiData.plainText;
      embedding = aiData.embedding;
      embeddingGenerated = true;
    } catch {
      warnings.push(
        "Banner was created, but AI embedding generation failed. AI indexing is pending.",
      );
    }

    const banner = await Banner.create({
      title,
      paragraph,
      italicTitle: italicTitle || "",
      image: imageUrl,
      publicId,
      plainText,
      embedding,
      isActive: active,
    });

    bannerCreated = true;

    try {
      await Document.create({
        type: "banner",
        content: combinedText,
        plainText,
        embedding,
        metadata: {
          bannerId: banner._id,
        },
        isActive: active && embeddingGenerated,
      });
    } catch {
      warnings.push(
        "Banner was created, but RAG Document synchronization failed.",
      );
    }

    try {
      await redis.del(CACHE_KEYS.BANNERS_ALL);
    } catch {
      warnings.push("Banner list cache invalidation is pending.");
    }

    revalidatePath("/");

    return NextResponse.json(
      {
        success: true,
        message: "Banner created successfully",
        data: banner,
        ai: {
          embeddingGenerated,
          indexingPending: !embeddingGenerated,
        },
        warnings,
      },
      { status: 201 },
    );
  } catch (error: any) {
    if (publicId && !bannerCreated) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error creating Banner",
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
