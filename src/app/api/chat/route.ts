import { connectDB } from "@/lib/db";
import { buildBannerRAG } from "@/lib/ai/ragBanner";
import { buildAboutRAG } from "@/lib/ai/ragAbout";
import { buildTimelineRAG } from "@/lib/ai/ragTimeline";
import { buildProjectRAG } from "@/lib/ai/ragProjects";
import { buildSkillsRAG } from "@/lib/ai/ragSkills";
import AboutUs from "@/models/AboutUs";
import { runAIChain } from "@/lib/langchain/chain";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    await connectDB();

    const q = question.toLowerCase();

    // detect project related query
    const isProjectQuery =
      q.includes("project") ||
      q.includes("portfolio") ||
      q.includes("work") ||
      q.includes("demo");

    const banner = await buildBannerRAG(question);
    const about = await buildAboutRAG(question);
    const timeline = await buildTimelineRAG(question);
    const skills = buildSkillsRAG();
    let projects: {
      text: string;
      cards: { title: string; image: string; link: string }[];
    } = {
      text: "",
      cards: [],
    };

    if (isProjectQuery) {
      projects = await buildProjectRAG(question);
    }

    const structuredContext = JSON.stringify({
      profile: banner?.slice(0, 200),
      about: about?.slice(0, 300),
      skills,
      timeline: timeline?.slice(0, 200),
      projects: isProjectQuery ? projects.text?.slice(0, 300) : "",
    });

    const answer = await runAIChain(structuredContext, question);

    const aboutData = await AboutUs.findOne({ isActive: true });

    const isResumeQuery =
      q.includes("resume") ||
      q.includes("cv") ||
      q.includes("download");

    return Response.json({
      answer,
      projectCards: isProjectQuery ? projects.cards : [],
      resume: isResumeQuery ? aboutData?.resume || "" : "",
    });

  } catch (err: any) {
    console.error("AI ERROR:", err);

    if (err?.status === 429) {
      return Response.json({
        answer: `
⚠️ AI is taking a short break right now.

Please try again later.
`,
        isQuota: true,
      });
    }

    return Response.json(
      {
        answer: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}