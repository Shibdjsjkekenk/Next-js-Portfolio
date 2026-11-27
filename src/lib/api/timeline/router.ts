import { NextRequest, NextResponse } from "next/server";

export async function handleTimeline(
  req: NextRequest,
  segments: string[]
) {
  const [action, value] = segments;
  const method = req.method;

  const notAllowed = () =>
    NextResponse.json(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );

  // Routes without ID
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

      case "update-order": {
        if (method !== "PUT") return notAllowed();
        const { PUT } = await import("./update-order/route");
        return PUT(req);
      }
    }
  }

  // Routes with ID or category
  if (segments.length === 2 && value) {
    switch (action) {
      case "get": {
        if (method !== "GET") return notAllowed();
        const { GET } = await import("./get/[id]/route");
        return GET(req, {
          params: Promise.resolve({ id: value }),
        });
      }

      case "get-by-category": {
        if (method !== "GET") return notAllowed();
        const { GET } = await import("./get-by-category/[category]/route");
        return GET(req, {
          params: Promise.resolve({ category: value }),
        });
      }

      case "update": {
        if (method !== "PUT") return notAllowed();
        const { PUT } = await import("./update/[id]/route");
        return PUT(req, {
          params: Promise.resolve({ id: value }),
        });
      }

      case "update-status": {
        if (method !== "PATCH") return notAllowed();
        const { PATCH } = await import("./update-status/[id]/route");
        return PATCH(req, {
          params: Promise.resolve({ id: value }),
        });
      }

      case "delete": {
        if (method !== "DELETE") return notAllowed();
        const { DELETE } = await import("./delete/[id]/route");
        return DELETE(req, {
          params: Promise.resolve({ id: value }),
        });
      }
    }
  }

  return NextResponse.json(
    { success: false, message: "Timeline API route not found" },
    { status: 404 }
  );
}