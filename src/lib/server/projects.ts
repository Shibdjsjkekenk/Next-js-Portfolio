import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { unstable_noStore as noStore } from "next/cache";

export async function getActiveProjects() {
  noStore(); // disable Next.js cache

  try {
    await connectDB();

    const projects = await Project.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return projects || [];

  } catch (e) {
    console.error("Active projects fetch failed", e);
    return [];
  }
}