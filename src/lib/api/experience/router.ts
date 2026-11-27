import { NextRequest, NextResponse } from "next/server";

export async function handleExperience(
  req: NextRequest,
  segments: string[]
) {
  const [action, id] = segments;
  const method = req.method;

  const notAllowed = () =>
    NextResponse.json(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );

  if (segments.length === 1) {
    switch (action) {
      case "create": {
        if (method !== "POST") return notAllowed();
        const { POST } = await import("./create/route");
        return POST(req);
      }

      case "get-all": {
        if (method !== "GET") return notAllowed();
        const { GET } = await import("./get-all/route");
        return GET();
      }
    }
  }

  if (segments.length === 2 && id) {
    const ctx = {
      params: Promise.resolve({ id }),
    };

    switch (action) {
      case "get": {
        if (method !== "GET") return notAllowed();
        const { GET } = await import("./get/[id]/route");
        return GET(req, ctx);
      }

      case "update": {
        if (method !== "PUT") return notAllowed();
        const { PUT } = await import("./update/[id]/route");
        return PUT(req, ctx);
      }

      case "update-status": {
        if (method !== "PATCH") return notAllowed();
        const { PATCH } = await import("./update-status/[id]/route");
        return PATCH(req, ctx);
      }

      case "delete": {
        if (method !== "DELETE") return notAllowed();
        const { DELETE } = await import("./delete/[id]/route");
        return DELETE(req, ctx);
      }
    }
  }

  return NextResponse.json(
    { success: false, message: "Experience API route not found" },
    { status: 404 }
  );
}