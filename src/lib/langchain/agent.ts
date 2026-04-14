import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

import {
  createTimelineTool,
  deleteTimelineTool,
  updateTimelineTool,
  getAllTimelineTool,
} from "@/lib/ai/timelineTools";

export const createAgent = async () => {
  const tools = [
    createTimelineTool,
    deleteTimelineTool,
    updateTimelineTool,
    getAllTimelineTool,
  ];

  const model = new ChatOpenAI({
    temperature: 0,
    modelName: "llama-3.3-70b-versatile",
    openAIApiKey: process.env.GROQ_API_KEY,
    configuration: {
      baseURL: "https://api.groq.com/openai/v1",
    },
  });

  const executor = await initializeAgentExecutorWithOptions(
    tools,
    model as any,
    {
      agentType: "zero-shot-react-description",
      verbose: false,
      maxIterations: 2,
      handleParsingErrors: true,

      agentArgs: {
        prefix: `
You are an intelligent admin AI.

You have access to tools connected to a database.

CRITICAL RULE:
When calling tools, ALWAYS extract the exact required value.

For delete tool:
👉 ONLY pass the category name
👉 DO NOT pass full sentence
👉 DO NOT include extra words

Example:
User: "delete elephant category"
Tool input: "elephant"

User: "remove education"
Tool input: "education"

Rules:
- NEVER guess
- ALWAYS use tools
- DO NOT loop
- DO NOT overthink

After using tool:
Return ONLY:

Final Answer: <result>
`
      }
    }
  );

  return executor;
};