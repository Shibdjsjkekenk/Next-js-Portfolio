import { connectDB } from "@/lib/db";
import { createAgent } from "@/lib/langchain/agent";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    await connectDB();

    const agent = await createAgent();

    const result = await agent.invoke({
      input: question,
    });

    return Response.json({
      answer: result.output,
    });

  } catch (err) {
    console.error("AI ERROR:", err);

    return Response.json({
      answer: "Something went wrong",
    });
  }
}