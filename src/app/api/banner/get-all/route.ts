import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";

export async function GET() {
    try {
        await connectDB();

        const banners = await Banner.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: banners,
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Error fetching Banners", error: error.message },
            { status: 500 }
        );
    }
}
