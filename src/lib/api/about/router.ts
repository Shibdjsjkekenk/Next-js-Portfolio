import { NextRequest, NextResponse } from "next/server";

type Handler = (
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) => Response | Promise<Response>;

export async function handleAbout(
  req: NextRequest,
  segments: string[]
) {
  const [action, id] = segments;
  const method = req.method;

  const call = (handler: Handler) =>
    handler(req, { params: Promise.resolve({ id }) });

  if (action === "get-all" && segments.length === 1) {
    if (method !== "GET") return methodNotAllowed();

    const { GET } = await import("./get-all/route");
    return GET();
  }

  if (action === "create" && segments.length === 1) {
    if (method !== "POST") return methodNotAllowed();

    const { POST } = await import("./create/route");
    return POST(req);
  }

  if (segments.length === 2 && id) {
    switch (action) {
      case "get": {
        if (method !== "GET") return methodNotAllowed();
        const { GET } = await import("./get/[id]/route");
        return call(GET);
      }

      case "update": {
        if (method !== "PUT") return methodNotAllowed();
        const { PUT } = await import("./update/[id]/route");
        return call(PUT);
      }

      case "update-status": {
        if (method !== "PATCH") return methodNotAllowed();
        const { PATCH } = await import("./update-status/[id]/route");
        return call(PATCH);
      }

      case "delete": {
        if (method !== "DELETE") return methodNotAllowed();
        const { DELETE } = await import("./delete/[id]/route");
        return call(DELETE);
      }
    }
  }

  return NextResponse.json(
    { success: false, message: "About API route not found" },
    { status: 404 }
  );
}

function methodNotAllowed() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}