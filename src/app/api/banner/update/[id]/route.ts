import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const body = await req.json();

    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!updatedBanner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    /* REDIS CACHE INVALIDATE */
    await redis.del(CACHE_KEYS.BANNERS_ALL);
    await redis.del(CACHE_KEYS.BANNER_BY_ID(id));

    return NextResponse.json({
      success: true,
      message: "Banner updated successfully",
      data: updatedBanner,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating Banner",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
