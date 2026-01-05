import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";  
import Banner from "@/models/Banner";


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { title, paragraph, italicTitle, image, isActive } = await req.json();

    if (!title || !paragraph) {
      return NextResponse.json(
        { success: false, message: "Title and Paragraph are required" },
        { status: 400 }
      );
    }

    const banner = await Banner.create({
      title,
      paragraph,
      italicTitle: italicTitle || "",
      image,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({
      success: true,
      message: "Banner created successfully",
      data: banner,
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error creating Banner", error: error.message },
      { status: 500 }
    );
  }
}
