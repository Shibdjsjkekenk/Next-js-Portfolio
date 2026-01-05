import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();

        const banner = await Banner.findById(params.id);
        if (!banner) {
            return NextResponse.json(
                { success: false, message: "Banner not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: banner });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Error fetching Banner", error: error.message },
            { status: 500 }
        );
    }
}
