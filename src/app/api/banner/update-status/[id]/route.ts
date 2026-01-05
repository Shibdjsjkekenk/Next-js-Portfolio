import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const { id } = await context.params;

        const { isActive } = await req.json();

        if (typeof isActive !== "boolean") {
            return NextResponse.json(
                { success: false, message: "isActive must be a boolean" },
                { status: 400 }
            );
        }

        const banner = await Banner.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        if (!banner) {
            return NextResponse.json(
                { success: false, message: "Banner not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Banner status updated to ${isActive ? "Active" : "Inactive"}`,
            data: banner,
        });

    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: "Error updating status",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
