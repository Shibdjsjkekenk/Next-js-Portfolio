import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

import {
  createTimelineTool,
  deleteTimelineTool,
  updateTimelineTool,
} from "@/lib/ai/timelineTools";

export const createAgent = async () => {
  const tools = [
    createTimelineTool,
    deleteTimelineTool,
    updateTimelineTool,
  ];

  const model = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
  });

  const executor = await initializeAgentExecutorWithOptions(
    tools,
    model as any,
    {
      agentType: "openai-functions",
      verbose: true,
    }
  );

  return executor;
};