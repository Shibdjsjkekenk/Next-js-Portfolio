import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";  
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    // auth (same as update role)
    const token = req.cookies.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const decoded: any = verifyToken(token);
    const sessionUser = decoded.userId;

    const { userId } = await req.json();

    // just for logging (same style as before)
    const user = await User.findById(sessionUser);
    console.log("user.role", user?.role);

    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      message: "User Deleted",
      success: true,
      error: false,
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        message: err.message || err,
        success: false,
        error: true,
      },
      { status: 401 }
    );
  }
}
