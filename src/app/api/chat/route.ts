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
const MAX_HISTORY_MESSAGES = 10;
const MAX_HISTORY_CONTENT_LENGTH = 2000;

type RAGResponse = {
  text: string;
  projectIds: string[];
};

type ConversationTurn = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  question?: unknown;
  embedding?: unknown;
  history?: unknown;
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

function sanitizeHistory(value: unknown): ConversationTurn[] {
  if (!Array.isArray(value)) return [];

  return value
    .slice(-MAX_HISTORY_MESSAGES)
    .filter(
      (item): item is Record<string, unknown> =>
        !!item && typeof item === "object" && !Array.isArray(item)
    )
    .filter(
      (item) =>
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim().length > 0
    )
    .map((item) => ({
      role: item.role as "user" | "assistant",
      content: (item.content as string)
        .trim()
        .slice(0, MAX_HISTORY_CONTENT_LENGTH),
    }));
}

export async function POST(req: Request) {
  try {
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
    const history = sanitizeHistory(body.history);

    await connectDB();

    // Resume URL is read from the database. No embedding is needed for this
    // direct database lookup.
    if (/\b(resume|cv|download)\b/i.test(normalizedQuestion)) {
      const aboutData = await AboutUs.findOne({ isActive: true })
        .select("resume")
        .lean();

      const resume = aboutData?.resume || "";

      // Let the LLM phrase the response using the database result.
      const resumeContext = resume
        ? `ABOUT:\nA resume/CV is available in the portfolio database.`
        : `ABOUT:\nNo resume/CV link is available in the portfolio database.`;

      const answer = await runAIChain(
        resumeContext,
        cleanQuestion,
        history
      );

      return Response.json({
        answer,
        projectCards: [],
        resume,
      });
    }

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

    const skills = await buildSkillsRAG();

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

    const context = `
PROFILE:
${bannerText.slice(0, 300)}

ABOUT:
${aboutText.slice(0, 500)}

SKILLS:
${skills || ""}

TIMELINE:
${timelineText.slice(0, 500)}

EXPERIENCE:
${experienceText.slice(0, 1500)}

PROJECTS:
${projectsText.slice(0, 1500)}
`;

    const safeContext = context.slice(0, MAX_CONTEXT_LENGTH);

    const answer = await runAIChain(
      safeContext,
      cleanQuestion,
      history
    );

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
