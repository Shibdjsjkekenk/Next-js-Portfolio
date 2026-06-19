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

    //  GET RESUME
    const aboutData = await AboutUs.findOne({ isActive: true });
    const resumeLink = aboutData?.resume || "";

    //  DIRECT RESUME
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

    //  RAG DATA
    const [
      banner,
      about,
      timeline,
      projectDataRaw,
      experience,
    ] = await Promise.all([
      getRAGContext(question, "banner"),
      getRAGContext(question, "about"),
      getRAGContext(question, "timeline"),
      getRAGContext(question, "project"),
      getRAGContext(question, "experience"),
    ]);

    const projectData = projectDataRaw as RAGResponse;

    const projectsText = projectData?.text ?? "";
    const projectIds = projectData?.projectIds ?? [];


    //  SKILLS (BULLET FORMAT)
    const skills = buildSkillsRAG();

    //  SAFE TEXT
    const bannerText =
      typeof banner === "string" ? banner : banner?.text || "";
    const aboutText =
      typeof about === "string" ? about : about?.text || "";
    const timelineText =
      typeof timeline === "string" ? timeline : timeline?.text || "";
    const experienceText = typeof experience === "string" ? experience : experience?.text || "";

    //  CLEAN CONTEXT (SECTION BASED)
    const context = `
PROFILE:
${bannerText.slice(0, 100)}

ABOUT:
${aboutText.slice(0, 150)}

SKILLS:
${skills}

TIMELINE:
${timelineText.slice(0, 150)}

EXPERIENCE:
${experienceText.slice(0, 1000)}

PROJECTS:
${projectsText.slice(0, 400)}
`;

    //  LIMIT CONTEXT
    const MAX_CONTEXT = 2000;
    const safeContext =
      context.length > MAX_CONTEXT
        ? context.slice(0, MAX_CONTEXT)
        : context;

    //  CORRECT AI CALL (NO DOUBLE PROMPT)
    const answer = await runAIChain(safeContext, question);

    //  PROJECT CARDS
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

    const isProjectRelated = q.includes("project");

    return Response.json({
      answer,
      projectCards: isProjectRelated ? projectCards : [],
      resume: "",
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