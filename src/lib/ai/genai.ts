import OpenAI from "openai";

const apiKey = process.env.GROQ_API_KEY!;

// production me ye log hata dena
// console.log("GROQ KEY START:", apiKey?.slice(0, 10));

export const ai = new OpenAI({
  apiKey,
  baseURL: "https://api.groq.com/openai/v1",
});