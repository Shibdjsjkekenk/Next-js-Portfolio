import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { revalidatePath } from "next/cache";

export async function PUT(req: NextRequest) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "No items to reorder" },
        { status: 400 }
      );
    }

    await connectDB();

    const bulk = items.map((item: any) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Project.bulkWrite(bulk);

    await redis.del(CACHE_KEYS.PROJECT_ALL);

    revalidatePath("/");
    revalidatePath("/admin/projects");

    return NextResponse.json({
      success: true,
      message: "Project order updated",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
