import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AboutUs from "@/models/AboutUs";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // ✅ async params fix
    const { id } = await context.params;

    const about = await AboutUs.findByIdAndDelete(id);
    if (!about) {
      return NextResponse.json(
        { success: false, message: "About Us not found" },
        { status: 404 }
      );
    }

    /* REDIS CACHE INVALIDATE */
    await redis.del(CACHE_KEYS.ABOUT_ALL);
    await redis.del(CACHE_KEYS.ABOUT_BY_ID(id));

    return NextResponse.json({
      success: true,
      message: "About Us deleted successfully",
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
