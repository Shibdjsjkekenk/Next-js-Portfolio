import Timeline from "@/models/Timeline";

export async function buildTimelineRAG(question: string) {
  const items = await Timeline.find({ isActive: true }).sort({ order: 1 });
  if (!items.length) return "";

  const q = question.toLowerCase();
  const questionWords = q.split(" ");

  let matched: string[] = [];

  items.forEach((item) => {
    const category = item.category.toLowerCase();
    const content = item.content.toLowerCase();

    // 1. category match
    const categoryMatch = questionWords.some((w) => category.includes(w));

    // 2. content semantic match
    const contentMatch = questionWords.some((w) => {
      if (w.length < 3) return false;
      return content.includes(w);
    });

    if (categoryMatch || contentMatch) {
      matched.push(item.content);
    }
  });

  // fallback → full timeline
  if (matched.length === 0) {
    matched = items.map((i) => i.content);
  }

  return matched.join("\n");
}