import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AboutUs from "@/models/AboutUs";
import Document from "@/models/Document";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { revalidatePath } from "next/cache";
import { prepareAIFields } from "@/lib/ai/embeddingHelper";
import cloudinary from "@/lib/cloudinary";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    // Find Existing About

    const existingAbout = await AboutUs.findById(id);

    if (!existingAbout) {
      return NextResponse.json(
        {
          success: false,
          message: "About Us not found",
        },
        {
          status: 404,
        },
      );
    }

    let updateData: any = { ...body };

    // Upload new image if changed

    if (body.image && body.image.startsWith("data:image")) {
      // Delete old Cloudinary image
      if (existingAbout.publicId) {
        await cloudinary.uploader.destroy(existingAbout.publicId);
      }

      // Upload new image
      const uploaded = await cloudinary.uploader.upload(body.image, {
        folder: "Personal-Portfolio",
      });

      updateData.image = uploaded.secure_url;
      updateData.publicId = uploaded.public_id;
    }

    // Upload new resume if changed
    if (body.resume && body.resume.startsWith("data:")) {
      try {
        // Delete old PDF from Cloudinary
        if (existingAbout.resumePublicId) {
          await cloudinary.uploader.destroy(existingAbout.resumePublicId, {
            resource_type: "raw",
          });
        }

        const uploadedResume = await cloudinary.uploader.upload(body.resume, {
          folder: "Personal-Portfolio",
          resource_type: "raw",
          public_id: "shubhanshu-tiwari-resume",
          format: "pdf",
          overwrite: true,
        });

        // Secure URL hi save karo
        updateData.resume = uploadedResume.secure_url;
        updateData.resumePublicId = uploadedResume.public_id;
      } catch (err) {
        console.error("PDF Upload Error:", err);
        throw err;
      }
    }

    let plainText = "";
    let embedding: number[] = [];

    //  regenerate only if content changed
    if (body.content) {
      const aiData = await prepareAIFields(body.content);

      plainText = aiData.plainText;
      embedding = aiData.embedding as number[];

      updateData.plainText = plainText;
      updateData.embedding = embedding;
    }

    // update AboutUs collection
    const about = await AboutUs.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!about) {
      return NextResponse.json(
        { success: false, message: "About Us not found" },
        { status: 404 },
      );
    }

    // IMPORTANT: sync Document collection
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
        },
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
