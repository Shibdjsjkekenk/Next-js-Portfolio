import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Project ID required" },
        { status: 400 }
      );
    }

    await Project.findByIdAndDelete(id);

    await redis.del(CACHE_KEYS.PROJECT_ALL);
    await redis.del(CACHE_KEYS.PROJECT_BY_ID(id));

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting project",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
