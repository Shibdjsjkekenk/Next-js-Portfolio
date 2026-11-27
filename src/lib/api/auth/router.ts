import { NextRequest, NextResponse } from "next/server";

export async function handleAuth(
  req: NextRequest,
  segments: string[]
) {
  if (segments.length !== 1) {
    return NextResponse.json(
      { success: false, message: "Auth API route not found" },
      { status: 404 }
    );
  }

  const [action] = segments;

  const methodNotAllowed = () =>
    NextResponse.json(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );

  switch (action) {
    case "login": {
      if (req.method !== "POST") return methodNotAllowed();

      const { POST } = await import("./login/route");
      return POST(req);
    }

    case "logout": {
      if (req.method !== "POST") return methodNotAllowed();

      const { POST } = await import("./logout/route");
      return POST();
    }

    case "me": {
      if (req.method !== "GET") return methodNotAllowed();

      const { GET } = await import("./me/route");
      return GET();
    }

    default:
      return NextResponse.json(
        { success: false, message: "Auth API route not found" },
        { status: 404 }
      );
  }
}