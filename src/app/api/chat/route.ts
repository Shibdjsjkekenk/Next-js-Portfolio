import { connectDB } from "@/lib/db";
import { getRAGContext } from "@/lib/ai/commonRAG";
import { buildSkillsRAG } from "@/lib/ai/ragSkills";
import AboutUs from "@/models/AboutUs";
import Project from "@/models/Project";
import { runAIChain } from "@/lib/langchain/chain";

type RAGResponse = {
  text: string;
  projectIds: string[];
};

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    await connectDB();

    const q = question.toLowerCase();

    // GET RESUME FROM DB FIRST
    const aboutData = await AboutUs.findOne({ isActive: true });
    const resumeLink = aboutData?.resume || "";

    //  RESUME DIRECT HANDLE (NO AI CALL → NO CRASH)
    if (
      q.includes("resume") ||
      q.includes("cv") ||
      q.includes("download")
    ) {
      return Response.json({
        answer: "Here is my resume. You can download it below.",
        projectCards: [],
        resume: resumeLink,
      });
    }

    // RAG DATA
    const banner = (await getRAGContext(question, "banner")) as unknown as
      | RAGResponse
      | string;

    const about = (await getRAGContext(question, "about")) as unknown as
      | RAGResponse
      | string;

    const timeline = (await getRAGContext(question, "timeline")) as unknown as
      | RAGResponse
      | string;

    //  PROJECT RAG
    const projectData = (await getRAGContext(
      question,
      "project"
    )) as RAGResponse;

    const projectsText = projectData?.text ?? "";
    const projectIds = projectData?.projectIds ?? [];

    // SKILLS LIMIT
    const skills = buildSkillsRAG().slice(0, 5);

    // ensure string
    const bannerText =
      typeof banner === "string" ? banner : banner?.text || "";
    const aboutText =
      typeof about === "string" ? about : about?.text || "";
    const timelineText =
      typeof timeline === "string" ? timeline : timeline?.text || "";

    // OPTIMIZED CONTEXT (VERY IMPORTANT)
    const structuredContext = JSON.stringify({
      profile: bannerText.slice(0, 100),
      about: aboutText.slice(0, 120),
      skills,
      timeline: timelineText.slice(0, 120),
      projects: projectsText.slice(0, 300),
    });

    // SAFE LIMIT (extra protection)
    const MAX_CONTEXT = 2000;
    const safeContext =
      structuredContext.length > MAX_CONTEXT
        ? structuredContext.slice(0, MAX_CONTEXT)
        : structuredContext;

    // AI RESPONSE
    const answer = await runAIChain(safeContext, question);

    // FETCH PROJECT CARDS
    let projectCards: any[] = [];

    if (projectIds.length > 0) {
      const dbProjects = await Project.find({
        _id: { $in: projectIds },
        isActive: true,
      });

      projectCards = dbProjects.map((p) => ({
        title: p.plainText?.slice(0, 50) || "Project",
        image: p.projectImage,
        link: p.projectLink,
        description: p.plainText?.slice(0, 120),
      }));
    }

    return Response.json({
      answer,
      projectCards,
      resume: resumeLink, // always send
    });

  } catch (err: any) {
    console.error("AI ERROR:", err);

    return Response.json(
      {
        answer: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}