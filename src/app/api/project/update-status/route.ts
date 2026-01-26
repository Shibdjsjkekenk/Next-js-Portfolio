import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { id, isActive } = await req.json();

    await Project.findByIdAndUpdate(id, { isActive });

    await redis.del(CACHE_KEYS.PROJECT_ALL);
    await redis.del(CACHE_KEYS.PROJECT_BY_ID(id));

    return NextResponse.json({
      success: true,
      message: "Project status updated",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating project status",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
