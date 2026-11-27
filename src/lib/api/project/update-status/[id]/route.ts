import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;
  const { isActive } = await req.json();

  const project = await Project.findByIdAndUpdate(
    id,
    { isActive },
    { new: true }
  );

  await redis.del(CACHE_KEYS.PROJECT_ALL);
  await redis.del(CACHE_KEYS.PROJECT_ACTIVE);
  await redis.del(CACHE_KEYS.PROJECT_BY_ID(id));

  return NextResponse.json({
    success: true,
    data: project,
  });
}