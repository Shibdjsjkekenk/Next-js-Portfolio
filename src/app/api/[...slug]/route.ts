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
      const { handleAbout } = await import("@/lib/api/about/router");
      return handleAbout(req, segments);
    }

    // Baad mein Project, Banner, Timeline yahan add honge.

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