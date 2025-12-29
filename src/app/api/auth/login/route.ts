import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import os from "os";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email & Password required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // 🔹 LOGIN TRACKING
    user.loginCount += 1;
    user.logins.push({
      deviceName: os.hostname(),
      ipAddress: "local",
      city: "Local",
      state: "Local",
      country: "Local",
      latitude: 0,
      longitude: 0,
    });
    await user.save();

    // 🔐 JWT TOKEN
    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    //  SERVER SIDE REDIRECT (IMPORTANT)
    const res = NextResponse.json({
      success: true,
      user: {
        role: user.role,
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    res.cookies.set("role", user.role, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;

  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
