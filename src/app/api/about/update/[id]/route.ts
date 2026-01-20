import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AboutUs from "@/models/AboutUs";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { revalidatePath } from "next/cache";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    // 🔥 MUST await params
    const { id } = await context.params;

    const body = await req.json();

    const about = await AboutUs.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!about) {
      return NextResponse.json(
        { success: false, message: "About Us not found" },
        { status: 404 },
      );
    }

    // CLEAR REDIS CACHE
    await redis.del(CACHE_KEYS.ABOUT_ALL);
    await redis.del(CACHE_KEYS.ABOUT_BY_ID(id));

    // REVALIDATE SSR
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
