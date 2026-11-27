import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Project ID required" },
        { status: 400 }
      );
    }

    const cacheKey = CACHE_KEYS.PROJECT_BY_ID(id);
    const cached = await redis.get(cacheKey);

    if (cached) {
      return NextResponse.json({
        success: true,
        source: "redis",
        data: JSON.parse(cached),
      });
    }

    await connectDB();
    const project = await Project.findById(id);

    await redis.set(
      cacheKey,
      JSON.stringify(project),
      "EX",
      CACHE_TTL.MEDIUM
    );

    return NextResponse.json({
      success: true,
      source: "db",
      data: project,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching project",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
