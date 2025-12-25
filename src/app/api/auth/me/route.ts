import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = cookies();      // ✅ FIX
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const decoded: any = verifyToken(token);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      data: user,
      error: false,
      success: true,
      message: "User details",
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        message: err.message || "Something went wrong",
        error: true,
        success: false,
      },
      { status: 401 }
    );
  }
}
