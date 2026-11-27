import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Document from "@/models/Document";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { prepareAIFields } from "@/lib/ai/embeddingHelper";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { content, projectImage, projectLink, order, isActive } =
      await req.json();

    // Upload Project Image

    let imageUrl = "";
    let publicId = "";

    if (projectImage) {
      const uploaded = await cloudinary.uploader.upload(projectImage, {
        folder: "Personal-Portfolio",
      });

      imageUrl = uploaded.secure_url;
      publicId = uploaded.public_id;
    }

    if (!content || !projectImage || !projectLink) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    // 1. Generate AI fields (HTML → plainText + embedding)
    const { plainText, embedding } = await prepareAIFields(content);

    const lastProject = await Project.findOne().sort({ order: -1 });

    // 2. Save in Project DB
    const project = await Project.create({
      content,
      projectImage: imageUrl,
      publicId,
      projectLink,
      plainText,
      embedding,
      order: lastProject ? lastProject.order + 1 : 0,
      isActive: isActive ?? true,
    });

    // 3. Save in Document (VECTOR DB)
    await Document.create({
      type: "project",
      content,
      plainText,
      embedding,
      metadata: {
        projectId: project._id,
      },
      isActive: isActive ?? true,
    });

    // cache clear
    await redis.del(CACHE_KEYS.PROJECT_ALL);

    return NextResponse.json({
      success: true,
      message: "Project created successfully",
      data: project,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error creating project",
        error: error.message,
      },
      { status: 500 }
    );
  }
}