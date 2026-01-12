import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
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
      message: "Banner deleted successfully",
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
