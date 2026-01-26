import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { items } = await req.json();
    // items = [{ id, order }]

    const bulkOps = items.map((item: any) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Project.bulkWrite(bulkOps);

    await redis.del(CACHE_KEYS.PROJECT_ALL);

    return NextResponse.json({
      success: true,
      message: "Project order updated",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating project order",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
