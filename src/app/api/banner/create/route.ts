import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import Document from "@/models/Document";
import { prepareAIFields } from "@/lib/ai/embeddingHelper";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
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
        { status: 400 }
      );
    }

    // Upload Image to Cloudinary

    let imageUrl = "";
    let publicId = "";

    if (image) {
      const uploaded = await cloudinary.uploader.upload(image, {
        folder: "Personal-Portfolio",
      });

      imageUrl = uploaded.secure_url;
      publicId = uploaded.public_id;
    }

    // AI Embedding

    const combinedText = `${title} ${paragraph} ${
      italicTitle || ""
    }`.trim();

    const { plainText, embedding } =
      await prepareAIFields(combinedText);

    // Save Banner

    const banner = await Banner.create({
      title,
      paragraph,
      italicTitle: italicTitle || "",
      image: imageUrl,      // Cloudinary URL
      publicId,             // Cloudinary Public ID
      plainText,
      embedding,
      isActive:
        isActive !== undefined ? isActive : true,
    });

    // Save Document

    await Document.create({
      type: "banner",
      content: combinedText,
      plainText,
      embedding,
      metadata: {
        bannerId: banner._id,
      },
      isActive:
        isActive !== undefined ? isActive : true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Banner created successfully",
        data: banner,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error creating Banner",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}