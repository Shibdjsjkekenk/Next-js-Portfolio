import { connectDB } from "@/lib/db";
import Timeline from "@/models/Timeline";
import { unstable_noStore as noStore } from "next/cache";

export async function getActiveTimelines() {
  noStore(); //  MOST IMPORTANT (disable Next.js cache)

  try {
    await connectDB();

    const timelines = await Timeline.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return timelines || [];

  } catch (e) {
    console.error("Timeline fetch failed", e);
    return [];
  }
}