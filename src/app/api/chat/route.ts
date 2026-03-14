import { connectDB } from "@/lib/db";
import { buildBannerRAG } from "@/lib/ai/ragBanner";
import { buildAboutRAG } from "@/lib/ai/ragAbout";
import { buildTimelineRAG } from "@/lib/ai/ragTimeline";
import { buildProjectRAG } from "@/lib/ai/ragProjects";
import { buildSkillsRAG } from "@/lib/ai/ragSkills";
import { ai } from "@/lib/ai/genai";
import AboutUs from "@/models/AboutUs";
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

    const ragContext = `
=== PROFILE ===
${banner?.slice(0, 200)}

=== ABOUT ===
${about?.slice(0, 400)}

=== SKILLS ===
${skills}

=== TIMELINE ===
${timeline?.slice(0, 200)}

${isProjectQuery ? `=== PROJECTS ===\n${projects.text?.slice(0, 300)}` : ""}
`;

    const completion = await ai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 120,
      messages: [
        {
          role: "system",
          content: `You are a professional portfolio AI.
Speak in first person as the developer.

Rules:
- Use only the provided context
- Do not invent information

If the user asks about projects:
Say "Here are my projects".`,
        },
        {
          role: "user",
          content: `
Context:
${ragContext}

User: ${question}
`,
        },
      ],
    });

    const answer =
      completion.choices[0]?.message?.content || "AI did not respond.";

    const aboutData = await AboutUs.findOne({ isActive: true });

    return Response.json({
      answer,
      projectCards: isProjectQuery ? projects.cards : [],
      resume: aboutData?.resume || ""
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