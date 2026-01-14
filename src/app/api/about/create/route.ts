import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AboutUs from "@/models/AboutUs";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { content, image, resume, isActive } = await req.json();

    if (!content) {
      return NextResponse.json(
        { success: false, message: "Content is required" },
        { status: 400 }
      );
    }

    const about = await AboutUs.create({
      content,
      image: image || "",
      resume: resume || "",
      isActive: isActive ?? true,
    });

    // invalidate list cache
    await redis.del(CACHE_KEYS.ABOUT_ALL);

    return NextResponse.json({
      success: true,
      message: "About Us created successfully",
      data: about,
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error creating About Us", error: error.message },
      { status: 500 }
    );
  }
}
