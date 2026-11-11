import { connectDB } from "@/lib/db";
import { getRAGContext } from "@/lib/ai/commonRAG";

import { buildSkillsRAG } from "@/lib/ai/ragSkills";
import AboutUs from "@/models/AboutUs";
import Project from "@/models/Project";
import { runAIChain } from "@/lib/langchain/chain";

export const runtime = "nodejs";

const EMBEDDING_DIMENSIONS = 384;
const MAX_QUESTION_LENGTH = 1000;
const MAX_CONTEXT_LENGTH = 5000;

type RAGResponse = {
  text: string;
  projectIds: string[];
};

type ChatRequestBody = {
  question?: unknown;
  embedding?: unknown;
};

function isValidEmbedding(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length === EMBEDDING_DIMENSIONS &&
    value.every(
      (item) => typeof item === "number" && Number.isFinite(item)
    )
  );
}

export async function POST(req: Request) {
  try {
    // 1. Parse and validate the incoming request.
    let body: ChatRequestBody;

    try {
      body = await req.json();
    } catch {
      return Response.json(
        { answer: "Invalid request body." },
        { status: 400 }
      );
    }

    const question = body?.question;

    if (
      typeof question !== "string" ||
      !question.trim() ||
      question.length > MAX_QUESTION_LENGTH
    ) {
      return Response.json(
        { answer: "Please enter a valid question." },
        { status: 400 }
      );
    }

    const cleanQuestion = question.trim();
    const normalizedQuestion = cleanQuestion.toLowerCase();

    // Resume requests do not need vector search or an embedding.
    await connectDB();

    // 2. Direct resume request.
    if (/\b(resume|cv|download)\b/i.test(normalizedQuestion)) {
      const aboutData = await AboutUs.findOne({
        isActive: true,
      })
        .select("resume")
        .lean();

      return Response.json({
        answer: "Here is my resume. You can download it below.",
        projectCards: [],
        resume: aboutData?.resume || "",
      });
    }

    // 3. Accept the embedding generated in the browser.
    // No Hugging Face Inference API or server-side model is used here.
    if (!isValidEmbedding(body.embedding)) {
      return Response.json(
        {
          answer:
            "The browser could not create a valid search vector. Please reload the page and try again.",
        },
        { status: 400 }
      );
    }

    const queryEmbedding = body.embedding;

    // 4. Reuse the same browser-generated embedding for all RAG searches.
    const [
      banner,
      about,
      timeline,
      projectDataRaw,
      experience,
    ] = await Promise.all([
      getRAGContext(cleanQuestion, queryEmbedding, "banner"),
      getRAGContext(cleanQuestion, queryEmbedding, "about"),
      getRAGContext(cleanQuestion, queryEmbedding, "timeline"),
      getRAGContext(cleanQuestion, queryEmbedding, "project"),
      getRAGContext(cleanQuestion, queryEmbedding, "experience"),
    ]);

    const projectData = projectDataRaw as RAGResponse;
    const projectsText = projectData?.text || "";
    const projectIds = projectData?.projectIds || [];

    // 5. Skills context.
    const skills = await buildSkillsRAG();

    // 6. Extract safe text from each RAG response.
    const bannerText =
      typeof banner === "string" ? banner : banner?.text || "";

    const aboutText =
      typeof about === "string" ? about : about?.text || "";

    const timelineText =
      typeof timeline === "string" ? timeline : timeline?.text || "";

    const experienceText =
      typeof experience === "string"
        ? experience
        : experience?.text || "";

    // 7. Build bounded context for the LLM.
    const context = `
PROFILE:
${bannerText.slice(0, 300)}

ABOUT:
${aboutText.slice(0, 500)}

SKILLS:
${skills || "No skills information available."}

TIMELINE:
${timelineText.slice(0, 500)}

EXPERIENCE:
${experienceText.slice(0, 1500)}

PROJECTS:
${projectsText.slice(0, 1500)}
`;

    const safeContext = context.slice(0, MAX_CONTEXT_LENGTH);

    // 8. Generate the answer using the configured Groq chain.
    const answer = await runAIChain(safeContext, cleanQuestion);

    // 9. Fetch project cards only for project-related questions.
    let projectCards: {
      title: string;
      image: string;
      link: string;
      description: string;
    }[] = [];

    const isProjectRelated = /\b(project|projects)\b/i.test(normalizedQuestion);

    if (isProjectRelated && projectIds.length > 0) {
      const dbProjects = await Project.find({
        _id: { $in: projectIds },
        isActive: true,
      }).lean();

      projectCards = dbProjects.map((project: any) => ({
        title: project.plainText?.slice(0, 50) || "Project",
        image: project.projectImage || "",
        link: project.projectLink || "",
        description: project.plainText?.slice(0, 120) || "",
      }));
    }

    // 10. Return the response in the shape expected by AiChatModal.
    return Response.json({
      answer,
      projectCards,
      resume: "",
    });
  } catch (error: any) {
    console.error("AI CHAT ERROR:", error);
    console.error("ERROR MESSAGE:", error?.message);
    console.error("ERROR STACK:", error?.stack);

    return Response.json(
      {
        answer:
          process.env.NODE_ENV === "development"
            ? error?.message || "Unknown AI error"
            : "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}
