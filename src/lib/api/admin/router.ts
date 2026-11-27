import { NextRequest, NextResponse } from "next/server";

export async function handleAdmin(
  req: NextRequest,
  segments: string[]
) {
  if (segments.length !== 1) {
    return NextResponse.json(
      { success: false, message: "Admin API route not found" },
      { status: 404 }
    );
  }

  const [action] = segments;

  switch (action) {
    case "all-users": {
      if (req.method !== "GET") return methodNotAllowed();

      const { GET } = await import("./all-users/route");
      return GET(req);
    }

    case "delete-user": {
      if (req.method !== "DELETE") return methodNotAllowed();

      const { DELETE } = await import("./delete-user/route");
      return DELETE(req);
    }

    case "update-user": {
      if (req.method !== "PUT") return methodNotAllowed();

      const { PUT } = await import("./update-user/route");
      return PUT(req);
    }

    default:
      return NextResponse.json(
        { success: false, message: "Admin API route not found" },
        { status: 404 }
      );
  }
}

function methodNotAllowed() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}