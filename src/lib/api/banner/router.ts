import { NextRequest, NextResponse } from "next/server";

export async function handleBanner(
  req: NextRequest,
  segments: string[]
) {
  const [action, id] = segments;
  const method = req.method;

  // GET /api/banner/get-all
  if (action === "get-all" && segments.length === 1) {
    if (method !== "GET") return methodNotAllowed();

    const { GET } = await import("./get-all/route");
    return GET();
  }

  // POST /api/banner/create
  if (action === "create" && segments.length === 1) {
    if (method !== "POST") return methodNotAllowed();

    const { POST } = await import("./create/route");
    return POST(req);
  }

  if (segments.length === 2 && id) {
    const ctx = {
      params: Promise.resolve({ id }),
    };

    switch (action) {
      case "get": {
        if (method !== "GET") return methodNotAllowed();

        const { GET } = await import("./get/[id]/route");
        return GET(req, ctx);
      }

      case "update": {
        if (method !== "PUT") return methodNotAllowed();

        const { PUT } = await import("./update/[id]/route");
        return PUT(req, ctx);
      }

      case "update-status": {
        if (method !== "PATCH") return methodNotAllowed();

        const { PATCH } = await import("./update-status/[id]/route");
        return PATCH(req, ctx);
      }

      case "delete": {
        if (method !== "DELETE") return methodNotAllowed();

        const { DELETE } = await import("./delete/[id]/route");
        return DELETE(req, ctx);
      }
    }
  }

  return NextResponse.json(
    { success: false, message: "Banner API route not found" },
    { status: 404 }
  );
}

function methodNotAllowed() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}