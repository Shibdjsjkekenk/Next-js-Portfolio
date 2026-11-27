import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AboutUs from "@/models/AboutUs";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // ✅ async params fix
    const { id } = await context.params;
    const { isActive } = await req.json();

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, message: "isActive must be boolean" },
        { status: 400 }
      );
    }

    const about = await AboutUs.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!about) {
      return NextResponse.json(
        { success: false, message: "About Us not found" },
        { status: 404 }
      );
    }

    /* 🔥 REDIS CACHE INVALIDATE */
    await redis.del(CACHE_KEYS.ABOUT_ALL);
    await redis.del(CACHE_KEYS.ABOUT_BY_ID(id));

    return NextResponse.json({
      success: true,
      message: `About Us status updated to ${isActive ? "Active" : "Inactive"}`,
      data: about,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating status",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
