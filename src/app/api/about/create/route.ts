import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AboutUs from "@/models/AboutUs";
import Document from "@/models/Document";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { prepareAIFields } from "@/lib/ai/embeddingHelper";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { content, image, resume, isActive } = await req.json();

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

    // Upload Resume to Cloudinary

    let resumeUrl = "";
    let resumePublicId = "";

    if (resume) {
      const uploadedResume = await cloudinary.uploader.upload(resume, {
        folder: "Personal-Portfolio",
        resource_type: "auto",
        public_id: "shubhanshu-tiwari-resume",
        overwrite: true,
      });
      resumeUrl = uploadedResume.secure_url;
      resumePublicId = uploadedResume.public_id;
    }

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
      image: imageUrl,
      publicId,
      resume: resumeUrl,
      resumePublicId,
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