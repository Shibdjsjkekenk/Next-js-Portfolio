import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, ...updates } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Project ID required" },
        { status: 400 }
      );
    }

    const project = await Project.findByIdAndUpdate(id, updates, {
      new: true,
    });

    // 🔥 invalidate caches
    await redis.del(CACHE_KEYS.PROJECT_ALL);
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
