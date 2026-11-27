import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import os from "os";
import axios from "axios";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import LoginAttempt from "@/models/LoginAttempt";
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

    /* ================= GET REAL IP ================= */
    const forwarded = req.headers.get("x-forwarded-for");
    let ip = forwarded?.split(",")[0] || "127.0.0.1";

    if (ip.includes("::ffff:")) {
      ip = ip.split("::ffff:").pop() || ip;
    }

    const normalizedEmail = email.toLowerCase();

    /* ================= LOGIN ATTEMPT ================= */
    let loginAttempt = await LoginAttempt.findOne({
      ip,
      email: normalizedEmail,
    });

    if (
      loginAttempt?.lockUntil &&
      loginAttempt.lockUntil > new Date()
    ) {
      const remainingSeconds = Math.ceil(
        (loginAttempt.lockUntil.getTime() - Date.now()) / 1000
      );

      return NextResponse.json(
        {
          message: `Too many failed attempts. Try again after ${remainingSeconds} seconds.`,
        },
        {
          status: 429,
        }
      );
    }

    /* ================= USER ================= */
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {

      if (!loginAttempt) {
        loginAttempt = await LoginAttempt.create({
          ip,
          email: normalizedEmail,
          attempts: 1,
        });

      } else {
        loginAttempt.attempts += 1;

        if (loginAttempt.attempts >= 3) {
          loginAttempt.lockUntil = new Date(
            Date.now() + 60 * 1000
          );

          await loginAttempt.save();

          return NextResponse.json(
            {
              message:
                "Too many failed attempts. Locked for 1 minute.",
            },
            {
              status: 429,
            }
          );
        }

        await loginAttempt.save();
      }

      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {

      if (!loginAttempt) {
        loginAttempt = await LoginAttempt.create({
          ip,
          email: normalizedEmail,
          attempts: 1,
        });
      } else {
        loginAttempt.attempts += 1;
        if (loginAttempt.attempts >= 3) {
          loginAttempt.lockUntil = new Date(
            Date.now() + 60 * 1000
          );

          await loginAttempt.save();

          return NextResponse.json(
            {
              message:
                "Too many failed attempts. Locked for 1 minute.",
            },
            {
              status: 429,
            }
          );
        }

        await loginAttempt.save();
      }

      const remainingAttempts =
        3 - loginAttempt.attempts;

      return NextResponse.json(
        {
          message:
            remainingAttempts > 0
              ? `Invalid password. ${remainingAttempts} attempts remaining.`
              : "Too many failed attempts. Locked for 1 minute.",
        },
        {
          status:
            remainingAttempts > 0
              ? 401
              : 429,
        }
      );
    }

    if (loginAttempt) {
      await LoginAttempt.deleteOne({
        _id: loginAttempt._id,
      });
    }
    const isLocal =
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip.startsWith("192.168");

    /* ================= GEO LOOKUP ================= */
    let city = "Local",
      state = "Local",
      country = "Local",
      latitude = 19.076,
      longitude = 72.8777;

    if (!isLocal) {
      try {
        const geo = await axios.get(
          `http://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon`
        );

        if (geo.data.status === "success") {
          city = geo.data.city || city;
          state = geo.data.regionName || state;
          country = geo.data.country || country;
          latitude = geo.data.lat || latitude;
          longitude = geo.data.lon || longitude;
        }
      } catch {
        console.log("Geo lookup failed");
      }
    }

    /* ================= LOGIN TRACKING ================= */
    user.loginCount = (user.loginCount || 0) + 1;

    const loginData = {
      deviceName: os.hostname(),
      ipAddress: ip,
      city,
      state,
      country,
      latitude,
      longitude,
      loggedInAt: new Date(),
    };

    user.logins.push(loginData);

    // ✅ LIMIT LOGIN HISTORY (prevents DB bloat)
    if (user.logins.length > 50) {
      user.logins = user.logins.slice(-50);
    }

    await user.save();

    /* ================= JWT TOKEN ================= */
    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      success: true,
      user: {
        role: user.role,
        loginCount: user.loginCount,
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