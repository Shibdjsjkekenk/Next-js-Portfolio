import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import os from "os";
import axios from "axios";
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

    // login tracking (same as MERN)
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

    // 🔐 JWT
    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // 🍪 TOKEN COOKIE
    res.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
      path: "/",              // 🔥 ADD THIS
    });

    // 🍪 ROLE COOKIE
    res.cookies.set("role", user.role, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
      path: "/",              // 🔥 ADD THIS
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
