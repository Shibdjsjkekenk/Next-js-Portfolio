import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Experience from "@/models/Experience";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const { isActive } = await req.json();

    const experience = await Experience.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!experience) {
      return NextResponse.json(
        { success: false, message: "Experience not found" },
        { status: 404 }
      );
    }

    await redis.del(CACHE_KEYS.EXPERIENCE_ALL);
    await redis.del(CACHE_KEYS.EXPERIENCE_BY_ID(id));

    revalidatePath("/");
    revalidatePath("/projects");

    return NextResponse.json({
      success: true,
      message: "Status updated",
      data: experience,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Status update failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
