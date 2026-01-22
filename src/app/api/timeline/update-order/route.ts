import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Timeline from "@/models/Timeline";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import { revalidatePath } from "next/cache"; // 🔥 ADD THIS

export async function PUT(req: NextRequest) {
  try {
    const { orders } = await req.json();

    await connectDB();

    const bulk = orders.map((item: any) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Timeline.bulkWrite(bulk);

    // Clear Redis
    await redis.del(CACHE_KEYS.TIMELINE_ALL);

    // REVALIDATE SERVER PAGES
    revalidatePath("/");    
    // revalidatePath("/about");  agre or kahi bhi use ho rha hoga too page ko yaha per import karnege mere isme abhi home page per ho rha hai
    // revalidatePath("/portfolio"); 

    return NextResponse.json({
      success: true,
      message: "Timeline order updated",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
