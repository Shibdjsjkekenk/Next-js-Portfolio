import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { content, projectImage, projectLink, order, isActive } =
      await req.json();

    if (!content || !projectImage || !projectLink) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    const lastProject = await Project.findOne().sort({ order: -1 });

    const project = await Project.create({
      content,
      projectImage,
      projectLink,
      order: lastProject ? lastProject.order + 1 : 0,
      isActive: isActive ?? true,
    });

    // invalidate list cache
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
