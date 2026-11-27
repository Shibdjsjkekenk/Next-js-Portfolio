import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ slug: string[] }>;
};

async function gateway(req: NextRequest, ctx: Context) {
  const { slug } = await ctx.params;
  const [module, ...segments] = slug;

  switch (module) {
    case "about": {
      const { handleAbout } = await import(
        "@/lib/api/about/router"
      );
      return handleAbout(req, segments);
    }

    case "banner": {
      const { handleBanner } = await import(
        "@/lib/api/banner/router"
      );
      return handleBanner(req, segments);
    }

    case "project": {
      const { handleProject } = await import(
        "@/lib/api/project/router"
      );
      return handleProject(req, segments);
    }

    case "experience": {
      const { handleExperience } = await import(
        "@/lib/api/experience/router"
      );
      return handleExperience(req, segments);
    }

    case "timeline": {
      const { handleTimeline } = await import(
        "@/lib/api/timeline/router"
      );
      return handleTimeline(req, segments);
    }

    case "admin": {
      const { handleAdmin } = await import(
        "@/lib/api/admin/router"
      );
      return handleAdmin(req, segments);
    }

    case "auth": {
      const { handleAuth } = await import(
        "@/lib/api/auth/router"
      );
      return handleAuth(req, segments);
    }

    case "ai": {
      if (segments.length !== 0) {
        return NextResponse.json(
          { success: false, message: "AI API route not found" },
          { status: 404 }
        );
      }

      if (req.method !== "POST") {
        return NextResponse.json(
          { success: false, message: "Method not allowed" },
          { status: 405 }
        );
      }

      const { POST } = await import("@/lib/api/ai/route");
      return POST(req);
    }

    case "chat": {
      if (segments.length !== 0) {
        return NextResponse.json(
          { success: false, message: "Chat API route not found" },
          { status: 404 }
        );
      }

      if (req.method !== "POST") {
        return NextResponse.json(
          { success: false, message: "Method not allowed" },
          { status: 405 }
        );
      }

      const { POST } = await import("@/lib/api/chat/route");
      return POST(req);
    }

    default:
      return NextResponse.json(
        { success: false, message: "API route not found" },
        { status: 404 }
      );
  }
}

export {
  gateway as GET,
  gateway as POST,
  gateway as PUT,
  gateway as PATCH,
  gateway as DELETE,
};