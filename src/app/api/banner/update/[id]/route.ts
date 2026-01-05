import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();

        const body = await req.json();

        const updatedBanner = await Banner.findByIdAndUpdate(
            params.id,
            body,
            { new: true }
        );

        if (!updatedBanner) {
            return NextResponse.json(
                { success: false, message: "Banner not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Banner updated successfully",
            data: updatedBanner,
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Error updating Banner", error: error.message },
            { status: 500 }
        );
    }
}
