import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Experience from "@/models/Experience";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

export async function GET() {
  const cached = await redis.get(CACHE_KEYS.EXPERIENCE_ALL);
  if (cached) return NextResponse.json(JSON.parse(cached));

  await connectDB();

  const list = await Experience.find()
    .sort({ createdAt: -1 })
    .lean();

  await redis.set(
    CACHE_KEYS.EXPERIENCE_ALL,
    JSON.stringify(list),
    "EX",
    CACHE_TTL.MEDIUM
  );

  return NextResponse.json(list);
}
