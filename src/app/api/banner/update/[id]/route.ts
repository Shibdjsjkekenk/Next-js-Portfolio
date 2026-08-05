import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import Document from "@/models/Document";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { revalidatePath } from "next/cache";
import { prepareAIFields } from "@/lib/ai/embeddingHelper";
import cloudinary from "@/lib/cloudinary";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    const existingBanner = await Banner.findById(id);

    if (!existingBanner) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner not found",
        },
        { status: 404 }
      );
    }

    let updateData: any = { ...body };

    // Upload new image if changed

    if (
      body.image &&
      body.image.startsWith("data:image")
    ) {
      // Delete old image
      if (existingBanner.publicId) {
        await cloudinary.uploader.destroy(
          existingBanner.publicId
        );
      }

      // Upload new image
      const uploaded = await cloudinary.uploader.upload(
        body.image,
        {
          folder: "Personal-Portfolio",
        }
      );

      updateData.image = uploaded.secure_url;
      updateData.publicId = uploaded.public_id;
    }

    let plainText = "";
    let embedding: number[] = [];

    //  regenerate only if text fields changed
    if (body.title || body.paragraph || body.italicTitle) {
      const combinedText = `${body.title || ""} ${body.paragraph || ""} ${body.italicTitle || ""}`.trim();

      const aiData = await prepareAIFields(combinedText);

      plainText = aiData.plainText;
      embedding = aiData.embedding as number[];

      updateData.plainText = plainText;
      updateData.embedding = embedding;
    }

    //  update Banner collection
    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedBanner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    //  sync Document collection
    if (body.title || body.paragraph || body.italicTitle) {
      const combinedText = `${updatedBanner.title} ${updatedBanner.paragraph} ${updatedBanner.italicTitle || ""}`.trim();

      await Document.findOneAndUpdate(
        {
          "metadata.bannerId": updatedBanner._id,
          type: "banner",
        },
        {
          content: combinedText,
          plainText,
          embedding,
          isActive: updatedBanner.isActive,
          metadata: {
            bannerId: updatedBanner._id,
          },
        }
      );
    }

    // cache clear
    await redis.del(CACHE_KEYS.BANNERS_ALL);
    await redis.del(CACHE_KEYS.BANNER_BY_ID(id));

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Banner updated successfully",
      data: updatedBanner,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating Banner",
        error: error.message,
      },
      { status: 500 }
    );
  }
}