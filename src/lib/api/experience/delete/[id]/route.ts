import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Experience from "@/models/Experience";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const experience = await Experience.findByIdAndDelete(id);

    if (!experience) {
      return NextResponse.json(
        { success: false, message: "Experience not found" },
        { status: 404 }
      );
    }

    /* ================= CACHE CLEAR ================= */
    await redis.del(CACHE_KEYS.EXPERIENCE_ALL);
    await redis.del(CACHE_KEYS.EXPERIENCE_BY_ID(id));

    /* ================= REVALIDATE ================= */
    revalidatePath("/");
    revalidatePath("/projects");

    return NextResponse.json({
      success: true,
      message: "Experience deleted",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Delete failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
