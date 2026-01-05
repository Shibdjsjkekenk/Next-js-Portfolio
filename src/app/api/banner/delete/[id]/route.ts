import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();

        const banner = await Banner.findByIdAndDelete(params.id);
        if (!banner) {
            return NextResponse.json(
                { success: false, message: "Banner not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Banner deleted successfully",
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}
