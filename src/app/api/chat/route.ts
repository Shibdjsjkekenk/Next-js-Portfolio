import { connectDB } from "@/lib/db";
import { buildBannerRAG } from "@/lib/ai/ragBanner";
import { buildTimelineRAG } from "@/lib/ai/ragTimeline";
import { buildProjectRAG } from "@/lib/ai/ragProjects";
import { ai } from "@/lib/ai/genai";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    await connectDB();

    const banner = await buildBannerRAG(question);
    const timeline = await buildTimelineRAG(question);
    const projects = await buildProjectRAG(question);

    const ragContext = `
=== PROFILE ===
${banner}

=== TIMELINE ===
${timeline}

=== PROJECTS ===
${projects.text}
`;

    const completion = await ai.chat.completions.create({
      model: "llama-3.3-70b-versatile", // best free Groq model
      messages: [
        {
          role: "system",
          content: `You are a professional portfolio AI.
If projects are asked:
- Respond briefly
- Say "Here are my projects"`,
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

    // console.log("Groq RAW:", completion);

    //  IMPORTANT: return cards
    return Response.json({
      answer,
      projectCards: projects.cards, // send cards to UI
    });
  } catch (err: any) {
    console.error("AI ERROR:", err);

    //  Detect Gemini quota error
    if (err?.status === 429) {
      return Response.json({
        answer: `
⚠️ AI is taking a short break right now.

I’ve reached my daily AI limit 🤖  
Please try again after some time.

Meanwhile, you can still explore:
• My projects 🚀
• My experience 💼
• My skills ⚡

Thanks for your patience ❤️
      `,
        isQuota: true, // optional flag
      });
    }

    return Response.json(
      {
        answer: "Something went wrong. Please try again later.",
      },
      { status: 500 },
    );
  }
}
