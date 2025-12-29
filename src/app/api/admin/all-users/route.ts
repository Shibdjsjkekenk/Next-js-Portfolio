import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    /* TOKEN FROM COOKIE */
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Access denied", success: false },
        { status: 403 }
      );
    }

    const allUsers = await User.find().select("-password");

    return NextResponse.json({
      message: "All Users",
      data: allUsers,
      success: true,
      error: false,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        message: err.message || "Server error",
        error: true,
        success: false,
      },
      { status: 400 }
    );
  }
}
