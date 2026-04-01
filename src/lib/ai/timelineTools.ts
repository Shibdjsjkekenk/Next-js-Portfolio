import { DynamicTool } from "langchain/tools";
import Timeline from "@/models/Timeline";

// ✅ CREATE TIMELINE
export const createTimelineTool = new DynamicTool({
  name: "create_timeline",
  description:
    "Create a new timeline. Input format: category | content",
  func: async (input: string) => {
    try {
      const [category, content] = input.split("|");

      if (!category || !content) {
        return "Invalid format. Use: category | content";
      }

      await Timeline.create({
        category: category.trim(),
        content: content.trim(),
      });

      return `Timeline "${category}" created successfully`;
    } catch (err) {
      return "Error creating timeline";
    }
  },
});

// ✅ DELETE TIMELINE
export const deleteTimelineTool = new DynamicTool({
  name: "delete_timeline",
  description: "Delete timeline by category (example: Experience)",
  func: async (input: string) => {
    const res = await Timeline.deleteMany({
      category: { $regex: input, $options: "i" },
    });

    return `${res.deletedCount} timeline(s) deleted`;
  },
});

// ✅ UPDATE TIMELINE
export const updateTimelineTool = new DynamicTool({
  name: "update_timeline",
  description:
    "Update timeline. Input format: category | new content",
  func: async (input: string) => {
    const [category, content] = input.split("|");

    if (!category || !content) {
      return "Invalid format. Use: category | content";
    }

    const res = await Timeline.updateOne(
      { category: { $regex: category.trim(), $options: "i" } },
      { $set: { content: content.trim() } }
    );

    if (res.matchedCount === 0) {
      return "No timeline found";
    }

    return `Timeline "${category}" updated successfully`;
  },
});