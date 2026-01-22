import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Timeline from "@/models/Timeline";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";

export async function PUT(req: NextRequest) {
  try {
    const { orders } = await req.json();
    // orders = [{ id, order }]

    await connectDB();

    const bulk = orders.map((item: any) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Timeline.bulkWrite(bulk);

    //  clear cache
    await redis.del(CACHE_KEYS.TIMELINE_ALL);

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
