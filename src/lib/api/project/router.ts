import { NextRequest, NextResponse } from "next/server";

export async function handleProject(
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

  // Routes without ID
  if (segments.length === 1) {
    switch (action) {
      case "create": {
        if (method !== "POST") return notAllowed();
        const { POST } = await import("./create/route");
        return POST(req);
      }

      case "get": {
        if (method !== "GET") return notAllowed();
        const { GET } = await import("./get/route");
        return GET(req);
      }

      case "get-all": {
        if (method !== "GET") return notAllowed();
        const { GET } = await import("./get-all/route");
        return GET();
      }

      case "update": {
        if (method !== "PUT") return notAllowed();
        const { PUT } = await import("./update/route");
        return PUT(req);
      }

      case "update-order": {
        if (method !== "PUT") return notAllowed();
        const { PUT } = await import("./update-order/route");
        return PUT(req);
      }

      case "delete": {
        if (method !== "DELETE") return notAllowed();
        const { DELETE } = await import("./delete/route");
        return DELETE(req);
      }
    }
  }

  // PATCH /api/project/update-status/[id]
  if (
    segments.length === 2 &&
    action === "update-status" &&
    id
  ) {
    if (method !== "PATCH") return notAllowed();

    const { PATCH } = await import("./update-status/[id]/route");

    return PATCH(req, {
      params: Promise.resolve({ id }),
    });
  }

  return NextResponse.json(
    { success: false, message: "Project API route not found" },
    { status: 404 }
  );
}