import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";  
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    // 
    const token = req.cookies.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const decoded: any = verifyToken(token);
    const sessionUser = decoded.userId;

    const { userId, role } = await req.json();

    const payload: any = {
      ...(role && { role }),
    };

    const user = await User.findById(sessionUser);
    console.log("user.role", user?.role);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      payload,
      { new: true }
    );

    return NextResponse.json({
      data: updatedUser,
      message: "User Updated",
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
