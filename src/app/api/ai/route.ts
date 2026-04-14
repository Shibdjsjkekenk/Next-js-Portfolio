import { connectDB } from "@/lib/db";
import Timeline from "@/models/Timeline";
import OpenAI from "openai";
import { handleRead } from "@/ai-agent/timelineService";
import {
  createBanner,
  getBanner,
  updateBanner,
  deleteBanner,
} from "@/ai-agent/bannerService";
import { bannerPrompt } from "@/ai-prompts/bannerPrompt";
import { timelinePrompt } from "@/ai-prompts/timelinePrompt";

const promptMap: any = {
  banner: bannerPrompt,
  timeline: timelinePrompt,
};

const ai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

const cleanHTMLForAI = (html: string) => {
  return html
    .replace(/<[^>]*>/g, " ") // remove tags
    .replace(/\s+/g, " ")
    .trim();
};


// STYLE OBJECT → STRING
const styleObjectToString = (style: Record<string, string>) => {
  return Object.entries(style)
    .map(([key, val]) => {
      const cssKey = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
      return `${cssKey}:${val}`;
    })
    .join(";");
};


// DYNAMIC ELEMENT RENDER
const renderElement = (item: any) => {
  if (typeof item === "string") {
    return `<p>${item}</p>`;
  }

  const tag = item.tag || "p";
  const text = item.value || "";
  const style = item.style || {};

  const styleString = styleObjectToString(style);

  return `<${tag} style="${styleString}">${text}</${tag}>`;
};

const mergeHTML = (oldHTML: string, updates: any) => {
  let updatedHTML = oldHTML;

  Object.values(updates).forEach((field: any) => {
    const { oldValue, newValue } = field;

    if (!oldValue || !newValue) return;

    // special characters escape
    const escapedOld = oldValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(escapedOld, "gi");
    updatedHTML = updatedHTML.replace(regex, newValue);
  });

  return updatedHTML;
};


//  BUILD HTML (FULLY DYNAMIC)
const buildHTML = (data: any) => {
  let html = "";

  Object.entries(data).forEach(([_, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        html += renderElement(v);
      });
    } else {
      html += renderElement(value);
    }
  });

  return html;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const question: string = body.question || "";
    const module: string = body.module || "";

    const selectedPrompt =
      promptMap[module?.toLowerCase()] || timelinePrompt;

    await connectDB();

    //  AI → DYNAMIC JSON
    const completion = await ai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: selectedPrompt(module),
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    let parsed: any;
    try {
      let raw = completion.choices[0].message.content || "";

      raw = raw.replace(/```json|```/g, "").trim();

      parsed = JSON.parse(raw);
    } catch {
      return Response.json({
        answer: "AI could not understand request",
      });
    }

    const { action, category, data, fields, target } = parsed;

    if (module === "Banner") {
      let result = "";

      if (action === "create") {
        result = await createBanner(data);
      }

      else if (action === "read") {
        result = await getBanner(fields);
      }

      else if (action === "update") {
        result = await updateBanner(question, data);
      }

      else if (action === "delete") {
        result = await deleteBanner(target);
      }

      return Response.json({ answer: result });
    }

    // CREATE
    if (action === "create") {
      if (!category || !data) {
        return Response.json({
          answer: "Missing category or data",
        });
      }

      const html = buildHTML(data);

      await Timeline.create({
        category: category.toLowerCase().replace("timeline", "").trim(),
        content: html,
      });

      return Response.json({
        answer: `Timeline "${category}" created successfully`,
      });
    }

    // DELETE
    if (action === "delete") {
      const res = await Timeline.deleteMany({
        category: { $regex: category, $options: "i" },
      });

      if (res.deletedCount === 0) {
        return Response.json({
          answer: "No matching timeline found",
        });
      }

      return Response.json({
        answer: `${res.deletedCount} timeline(s) deleted`,
      });
    }

    // UPDATE 
    if (action === "update") {

      const cleanCat = category.toLowerCase().replace("timeline", "").trim();

      const existing = await Timeline.findOne({
        category: { $regex: `^${cleanCat}$`, $options: "i" },
      });

      if (!existing) {
        return Response.json({ answer: `No timeline found for category: ${cleanCat}` });
      }


      let updateData: any = {};

      // isActive
      if (question.toLowerCase().includes("inactive")) {
        updateData.isActive = false;
      }
      else if (question.toLowerCase().includes("active")) {
        updateData.isActive = true;
      }

      // order
      const orderMatch = question.match(/order\s*(\d+)/i);
      if (orderMatch) {
        updateData.order = Number(orderMatch[1]);
      }

      //  अगर field update है → direct DB update करो
      if (Object.keys(updateData).length > 0) {
        await Timeline.updateOne(
          { _id: existing._id },
          { $set: updateData }
        );

        return Response.json({
          answer: `Timeline "${cleanCat}" updated successfully`,
        });
      }

      // 1. Existing content ko clean karke AI ko dikhao taaki wo oldValue sahi pakde
      const currentText = cleanHTMLForAI(existing.content);

      const updateCompletion = await ai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a precise text-replacement engine.
        
        TASK:
        1. Identify the EXACT text from 'Existing Content' that needs to be changed (oldValue).
        2. Identify the NEW text the user wants to put there (newValue).
        
        STRICT RULES:
        - 'oldValue' MUST be exactly present in the 'Existing Content'.
        - 'newValue' MUST NOT contain any instructions like "update this", "category", or "change to".
        - If user says "X ko Y kar do", oldValue is "X" and newValue is "Y".
        
        Return ONLY JSON: {"oldValue": "string", "newValue": "string"}`
          },
          {
            role: "user",
            content: `Existing Content: "${currentText}"\nUser Request: "${question}"`
          },
        ],
      });

      let extracted;
      try {
        extracted = JSON.parse(updateCompletion.choices[0].message.content!.replace(/```json|```/g, ""));
      } catch (e) {
        return Response.json({ answer: "AI extraction failed." });
      }

      const { oldValue, newValue } = extracted;

      if (!oldValue || !newValue) {
        return Response.json({ answer: "Could not identify what to change. Please try: 'X' ko 'Y' kar do." });
      }

      // CORE FIX: Sirf text replace hoga, HTML tags (h1, p, style) ko haath bhi nahi lagayenge
      let finalHTML = existing.content;

      // Regex escape taaki special characters se crash na ho
      const escapedOld = oldValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedOld, "g");

      if (finalHTML.includes(oldValue)) {
        finalHTML = finalHTML.replace(regex, newValue);

        await Timeline.updateOne(
          { _id: existing._id },
          { $set: { content: finalHTML } }
        );

        return Response.json({
          answer: `Updated "${oldValue}" to "${newValue}" in ${cleanCat}. Styles preserved.`,
        });
      } else {
        // Agar exact match na mile (spaces etc ka issue), toh fallback for partial match
        return Response.json({
          answer: `Could not find "${oldValue}" in the existing content. Make sure you use the exact words.`
        });
      }
    }

    // ✅ READ (FULLY DYNAMIC INDEXING)

    if (action === "read") {
      const result = await handleRead(question);

      return Response.json({
        answer: result,
      });
    }

  } catch (err) {
    console.error(err);
    return Response.json({
      answer: "Something went wrong",
    });
  }
}