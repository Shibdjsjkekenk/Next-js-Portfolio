import { connectDB } from "@/lib/db";
import { ai } from "@/lib/ai/genai";
import { createTimeline, updateTimeline, deleteTimeline, handleRead, } from "@/ai-agent/timelineService";
import { createBanner, getBanner, updateBanner, deleteBanner, } from "@/ai-agent/bannerService";
import { createProject, updateProject, deleteProject, handleProjectRead, } from "@/ai-agent/projectService";
import { bannerPrompt } from "@/ai-prompts/bannerPrompt";
import { timelinePrompt } from "@/ai-prompts/timelinePrompt";
import { projectPrompt } from "@/ai-prompts/projectPrompt";
import redis from "@/lib/redis";
import { CACHE_KEYS } from "@/lib/cacheKeys";
import Project from "@/models/Project";

const promptMap: any = {
  banner: bannerPrompt,
  timeline: timelinePrompt,
  project: projectPrompt,
};

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
      model: "openai/gpt-oss-120b",
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

    // Banner
    const { action, category, data, fields, target } = parsed;

    if (module.toLowerCase() === "banner") {
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

    // Project
    // Project
    if (module.toLowerCase() === "project") {
      let result = "";

      if (action === "create") {
        result = await createProject(
          data.content,
          data.projectLink,
          data.projectImage
        );
      }

      else if (action === "read") {
        const projects = await Project.find().sort({ order: 1 });

        return Response.json({
          answer: "Here are your projects:",
          cards: projects.map((p) => ({
            title: p.plainText?.slice(0, 40),
            description: p.plainText,
            image: p.projectImage,
            link: p.projectLink,
            isActive: p.isActive,
          })),
        });
      }
      else if (action === "update") {
        result = await updateProject(question, data);
      }

      else if (action === "delete") {
        result = await deleteProject(data.id);
      }

      await redis.del(CACHE_KEYS.PROJECT_ALL);

      return Response.json({ answer: result });
    }

    // Timeline
    // CREATE
    if (action === "create") {
      if (!category || !data) {
        return Response.json({
          answer: "Missing category or data",
        });
      }

      const html = buildHTML(data);

      // ✅ NEW (service use)
      const result = await createTimeline(category, html);

      await redis.del(CACHE_KEYS.TIMELINE_ALL);

      return Response.json({
        answer: result,
      });
    }


    // DELETE
    if (action === "delete") {

      // ✅ NEW (service use)
      const result = await deleteTimeline(category);

      await redis.del(CACHE_KEYS.TIMELINE_ALL);

      return Response.json({
        answer: result,
      });
    }


    // UPDATE 
    if (action === "update") {

      // ✅ NEW (service use)
      const result = await updateTimeline(question, { ...data, category });

      await redis.del(CACHE_KEYS.TIMELINE_ALL);

      return Response.json({
        answer: result,
      });
    }

    //  READ (FULLY DYNAMIC INDEXING)

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