import { DynamicTool } from "@langchain/core/tools"; // Updated import path
import Timeline from "@/models/Timeline";
import OpenAI from "openai";

// 1. AI Instance define karein (Tools file ke upar)
const ai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

// Helper
const parseInput = (input: any) => {
  return typeof input === "string" ? input : input?.input || "";
};

// 🔥 CREATE
export const createTimelineTool = new DynamicTool({
  name: "create_timeline",
  description: `
Creates a new timeline entry in the database.
Use when new structured information needs to be stored.
`,
  func: async (input: any) => {
    try {
      const value = parseInput(input);

      const [category, content] = value.split("|");

      if (!category || !content) {
        return "Final Answer: Invalid format. Use: category | content";
      }

      // format content (title + description)
      const parts = content.trim().split(".");
      const title = parts[0];
      const rest = parts.slice(1).join(".");

      const formattedContent = `
        <h5><strong>${title}</strong></h5>
        <p>${rest}</p>
      `;

      await Timeline.create({
        category: category.trim(),
        content: formattedContent,
      });

      return `Final Answer: Timeline "${category.trim()}" created successfully`;
    } catch (err) {
      return "Final Answer: Error creating timeline";
    }
  },
});

// 🔥 DELETE (NO STATIC KEYWORDS)
export const deleteTimelineTool = new DynamicTool({
  name: "delete_timeline",
  description: `
Creates a new timeline entry.

The AI must extract:
- category name
- content

Then convert into this format:
category | content

Example:
User: "add education Bachelor degree"
Tool input: "Education | Bachelor degree"
`,
  func: async (input: any) => {
    try {
      const value = parseInput(input).trim();

      if (!value) {
        return "Final Answer: No valid input provided.";
      }

      console.log("DELETE VALUE:", value);

      const res = await Timeline.deleteMany({
        category: { $regex: `^${value}$`, $options: "i" },
      });

      if (res.deletedCount === 0) {
        return "Final Answer: No matching timeline found in database.";
      }

      return `Final Answer: ${res.deletedCount} timeline(s) removed successfully. Task complete.`;
    } catch (err) {
      return "Final Answer: Error removing timeline.";
    }
  },
});

// 🔥 UPDATE
export const updateTimelineTool = new DynamicTool({
  name: "update_timeline",
  description: `
    Updates timeline data. 
    Input should be a natural language string containing the category and what to change.
  `,
  func: async (input: string) => {
    try {
      // 1. AI ko dobara call karein structured data nikalne ke liye (Jaise aapne POST route mein kiya tha)
      const completion = await ai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Extract update details from user prompt. 
            Return ONLY JSON: {"category": "string", "oldValue": "string", "newValue": "string", "isActive": boolean, "order": number}`
          },
          { role: "user", content: input }
        ]
      });

      const { category, oldValue, newValue, isActive, order } = JSON.parse(completion.choices[0].message.content!);

      const existing = await Timeline.findOne({
        category: { $regex: `^${category}$`, $options: "i" },
      });

      if (!existing) return "Final Answer: Timeline not found.";

      let updateData: any = {};

      // =========================
      // 🔥 FIELD UPDATE FIRST
      // =========================

      const isFieldUpdate =
        input.toLowerCase().includes("active") ||
        input.toLowerCase().includes("inactive") ||
        input.toLowerCase().includes("order");

      // direct AI values
      if (typeof isActive === "boolean") {
        updateData.isActive = isActive;
      }

      if (typeof order === "number") {
        updateData.order = order;
      }

      // 🔥 fallback text detection (independent hona chahiye)
      if (input.toLowerCase().includes("inactive")) {
        updateData.isActive = false;
      }
      else if (input.toLowerCase().includes("active")) {
        updateData.isActive = true;
      }

      // 🔥 order fallback (manual detection)
      const orderMatch = input.match(/order\s*(\d+)/i);
      if (orderMatch) {
        updateData.order = Number(orderMatch[1]);
      }

      // Text Update logic
      if (
        oldValue &&
        newValue &&
        !isFieldUpdate &&
        existing.content.toLowerCase().includes(oldValue.toLowerCase())
      ) {
        const escapedOld = oldValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escapedOld, "gi");

        // Check karein ki oldValue exist bhi karta hai ya nahi
        if (existing.content.includes(oldValue) || regex.test(existing.content)) {
          updateData.content = existing.content.replace(regex, newValue);
        } else {
          // Agar oldValue exact match nahi ho raha, toh content overwrite kar dein ya error dein
          updateData.content = `<p>${newValue}</p>`;
        }
      }

      if (Object.keys(updateData).length === 0) return "Final Answer: No changes detected.";

      await Timeline.updateOne({ _id: existing._id }, { $set: updateData });

      return `Final Answer: Timeline "${category}" updated successfully.`;
    } catch (err) {
      return "Final Answer: Error updating timeline.";
    }
  },
});

// 🔥 GET ALL
export const getAllTimelineTool = new DynamicTool({
  name: "get_timelines",
  description: "Retrieves timeline data. Can return the full list or a specific item based on user request.",
  func: async (input: string) => {
    try {
      let timelines = [];

      if (input.toLowerCase().includes("traveling")) {
        timelines = await Timeline.find({
          category: { $regex: "traveling", $options: "i" }
        }).sort({ order: 1, createdAt: 1 }).lean();
      } else {
        timelines = await Timeline.find({}).sort({ order: 1, createdAt: 1 }).lean();
      }

      if (!timelines.length) {
        return "Final Answer: No timeline data found in the database.";
      }

      // 1. AI ko list context bhejo taaki wo index nikal sake
      const categories = timelines.map((t, i) => `${i + 1}. ${t.category}`).join(", ");

      const indexCompletion = await ai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Analyze the user's request based on this list: [${categories}]
            
            - If they want a specific item (by name, position like 'last', or number), return its 1-based index.
            - If they want to see everything or no specific index is found, return null.
            
            Return ONLY JSON: {"indexes": number[] | null}`
          },
          { role: "user", content: input }
        ]
      });

      const { indexes } = JSON.parse(indexCompletion.choices[0].message.content || '{"indexes":null}');

      const strip = (h: string) => h.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

      // 2. Specific item return karein agar index match hua
      if (indexes && Array.isArray(indexes)) {
        const results = indexes
          .map((idx: number) => {
            const t = timelines[idx - 1];
            if (!t) return null;

            return `Item ${idx}: ${t.category} → ${strip(t.content)}`;
          })
          .filter(Boolean)
          .join("\n\n");

        return `Final Answer:\n${results}`;
      }

      // 3. Default: Sari timelines ki summary dikhao
      const summaryList = timelines
        .map((t, i) => `${i + 1}. ${t.category}: ${strip(t.content)}`)
        .join("\n");

      return `Final Answer: Total ${timelines.length} timelines found:\n${summaryList}`;

    } catch (err) {
      console.error("Fetch Error:", err);
      return "Final Answer: Error fetching timelines from database.";
    }
  },
});