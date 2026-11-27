import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Experience from "@/models/Experience";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const cached = await redis.get(CACHE_KEYS.EXPERIENCE_BY_ID(id));
  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }

  await connectDB();
  const experience = await Experience.findById(id).lean();

  if (!experience) {
    return NextResponse.json(null, { status: 404 });
  }

  await redis.set(
    CACHE_KEYS.EXPERIENCE_BY_ID(id),
    JSON.stringify(experience)
  );

  return NextResponse.json(experience);
}
