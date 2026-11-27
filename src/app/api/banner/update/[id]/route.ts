
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import Document from "@/models/Document";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";
import { revalidatePath } from "next/cache";
import { prepareAIFields } from "@/lib/ai/embeddingHelper";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  let newImagePublicId: string | undefined;
  const warnings: string[] = [];

  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    const existingBanner = await Banner.findById(id);

    if (!existingBanner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 },
      );
    }

    const updateData: Record<string, any> = { ...body };

    delete updateData._id;
    delete updateData.__v;
    delete updateData.plainText;
    delete updateData.embedding;
    delete updateData.publicId;

    const hasTextField = [
      "title",
      "paragraph",
      "italicTitle",
    ].some((field) => Object.prototype.hasOwnProperty.call(body, field));

    const nextTitle = body.title ?? existingBanner.title;
    const nextParagraph = body.paragraph ?? existingBanner.paragraph;
    const nextItalicTitle =
      body.italicTitle ?? existingBanner.italicTitle ?? "";

    const combinedText = [
      nextTitle,
      nextParagraph,
      nextItalicTitle,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    const contentChanged =
      hasTextField &&
      (
        nextTitle !== existingBanner.title ||
        nextParagraph !== existingBanner.paragraph ||
        nextItalicTitle !== (existingBanner.italicTitle || "")
      );

    if (
      typeof body.image === "string" &&
      body.image.startsWith("data:image")
    ) {
      const uploaded = await cloudinary.uploader.upload(body.image, {
        folder: "Personal-Portfolio",
      });

      newImagePublicId = uploaded.public_id;
      updateData.image = uploaded.secure_url;
      updateData.publicId = uploaded.public_id;
    }

    let embeddingGenerated = false;

    if (contentChanged) {
      try {
        const aiData = await prepareAIFields(combinedText);

        updateData.plainText = aiData.plainText;
        updateData.embedding = aiData.embedding;
        embeddingGenerated = true;
      } catch {
        warnings.push(
          "Banner was saved, but AI embedding generation failed. AI indexing is pending.",
        );
      }
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedBanner) {
      throw new Error("Banner update failed");
    }

    if (contentChanged) {
      try {
        const documentUpdate: Record<string, any> = {
          content: combinedText,
          isActive: embeddingGenerated
            ? updatedBanner.isActive
            : false,
          metadata: {
            bannerId: updatedBanner._id,
          },
        };

        if (embeddingGenerated) {
          documentUpdate.plainText = updatedBanner.plainText;
          documentUpdate.embedding = updatedBanner.embedding;
        } else {
          documentUpdate.plainText = existingBanner.plainText || "";
        }

        await Document.findOneAndUpdate(
          {
            "metadata.bannerId": updatedBanner._id,
            type: "banner",
          },
          {
            $set: documentUpdate,
            $setOnInsert: {
              type: "banner",
            },
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          },
        );
      } catch {
        warnings.push(
          "Banner was saved, but RAG Document synchronization failed.",
        );
      }
    }

    if (
      newImagePublicId &&
      existingBanner.publicId &&
      existingBanner.publicId !== newImagePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(existingBanner.publicId);
      } catch {
        warnings.push("Old Banner image cleanup is pending.");
      }
    }

    try {
      await redis.set(
        CACHE_KEYS.BANNER_BY_ID(id),
        JSON.stringify(updatedBanner.toObject()),
        "EX",
        CACHE_TTL.SHORT,
      );
    } catch {
      try {
        await redis.del(CACHE_KEYS.BANNER_BY_ID(id));
      } catch {}

      warnings.push("Banner cache update is pending.");
    }

    try {
      await redis.del(CACHE_KEYS.BANNERS_ALL);
    } catch {
      warnings.push("Banner list cache invalidation is pending.");
    }

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Banner updated successfully",
      data: updatedBanner,
      ai: {
        embeddingGenerated,
        indexingPending: contentChanged && !embeddingGenerated,
      },
      warnings,
    });
  } catch (error: any) {
    if (newImagePublicId) {
      try {
        await cloudinary.uploader.destroy(newImagePublicId);
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error updating Banner",
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
