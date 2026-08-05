import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Document from "@/models/Document";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { prepareAIFields } from "@/lib/ai/embeddingHelper";
import cloudinary from "@/lib/cloudinary";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const { id, ...updates } = await req.json();

    // Find Existing Project

    const existingProject = await Project.findById(id);

    if (!existingProject) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Project ID required" },
        { status: 400 }
      );
    }

    let updateData: any = { ...updates };

    // Upload new project image

    if (
      updates.projectImage &&
      updates.projectImage.startsWith("data:image")
    ) {
      // Delete old Cloudinary image
      if (existingProject.publicId) {
        await cloudinary.uploader.destroy(
          existingProject.publicId
        );
      }

      // Upload new image
      const uploaded = await cloudinary.uploader.upload(
        updates.projectImage,
        {
          folder: "Personal-Portfolio",
        }
      );

      updateData.projectImage = uploaded.secure_url;
      updateData.publicId = uploaded.public_id;
    }

    let plainText = "";
    let embedding: number[] = [];

    //  regenerate only if content changes
    if (updates.content) {
      const aiData = await prepareAIFields(updates.content);

      plainText = aiData.plainText;
      embedding = aiData.embedding as number[];

      updateData.plainText = plainText;
      updateData.embedding = embedding;
    }

    //  update Project DB
    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    //  sync Document (vector DB)
    if (updates.content) {
      await Document.findOneAndUpdate(
        {
          "metadata.projectId": project._id,
          type: "project",
        },
        {
          content: project.content,
          plainText,
          embedding,
          isActive: project.isActive,
          metadata: {
            projectId: project._id,
          },
        }
      );
    }

    // cache clear
    await redis.del(CACHE_KEYS.PROJECT_ALL);
    await redis.del(CACHE_KEYS.PROJECT_ACTIVE);
    await redis.del(CACHE_KEYS.PROJECT_BY_ID(id));

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating project",
        error: error.message,
      },
      { status: 500 }
    );
  }
}