
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const { isActive } = await req.json();

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, message: "isActive must be a boolean" },
        { status: 400 },
      );
    }

    const banner = await Banner.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true, runValidators: true },
    );

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 },
      );
    }

    const warnings: string[] = [];

    try {
      await redis.set(
        CACHE_KEYS.BANNER_BY_ID(id),
        JSON.stringify(banner.toObject()),
        "EX",
        CACHE_TTL.SHORT,
      );
    } catch {
      try {
        await redis.del(CACHE_KEYS.BANNER_BY_ID(id));
      } catch {}

      warnings.push("Banner cache update is pending.");
    }

    try {
      await redis.del(CACHE_KEYS.BANNERS_ALL);
    } catch {
      warnings.push("Banner list cache invalidation is pending.");
    }

    return NextResponse.json({
      success: true,
      message: `Banner status updated to ${isActive ? "Active" : "Inactive"}`,
      data: banner,
      warnings,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating status",
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
