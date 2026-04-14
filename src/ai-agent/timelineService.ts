import Timeline from "@/models/Timeline";

export const handleRead = async (question: string) => {
  let timelines = [];

  if (question.toLowerCase().includes("traveling")) {
    timelines = await Timeline.find({
      category: { $regex: "traveling", $options: "i" }
    }).sort({ order: 1, createdAt: 1 }).lean();
  } else {
    timelines = await Timeline.find({})
      .sort({ order: 1, createdAt: 1 })
      .lean();
  }

  if (!timelines.length) return "No timeline data found";

  const strip = (h: string) =>
    h.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  const numbers = question.match(/\d+/g)?.map(Number);

  if (numbers?.length) {
    return numbers
      .map((idx) => {
        const t = timelines[idx - 1];
        if (!t) return null;

        return `Item ${idx}:\n*${t.category.toUpperCase()}*\n${strip(t.content)}`;
      })
      .filter(Boolean)
      .join("\n\n");
  }

  return timelines
    .map((t, i) => `${i + 1}. ${t.category}: ${strip(t.content)}`)
    .join("\n");
};