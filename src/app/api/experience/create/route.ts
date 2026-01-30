import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Experience from "@/models/Experience";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { content, isActive = true } = await req.json();

    if (!content) {
      return NextResponse.json(
        { success: false, message: "Content is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const experience = await Experience.create({ content, isActive });

    //  clear cache
    await redis.del(CACHE_KEYS.EXPERIENCE_ALL);

    //  optional but recommended
    revalidatePath("/");
    revalidatePath("/experience");

    return NextResponse.json({
      success: true,
      message: "Experience content created",
      data: experience, 
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Create failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
