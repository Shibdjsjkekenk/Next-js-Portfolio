import Banner from "@/models/Banner";

export async function buildBannerRAG(question: string) {
  const banner = await Banner.findOne({ isActive: true });
  if (!banner) return "No portfolio data found.";

  const q = question.toLowerCase();

  const fields = [
    banner.title,
    banner.paragraph,
    banner.italicTitle,
  ].filter(Boolean);

  let matched: string[] = [];

  const questionWords = q.split(" ");

  fields.forEach((text) => {
    const lower = text.toLowerCase();

    // word-level semantic match (dynamic)
    const isMatch = questionWords.some((word) => {
      if (word.length < 3) return false; // ignore small words
      return lower.includes(word);
    });

    if (isMatch) matched.push(text);
  });

  // IMPORTANT: if partial match found → include full paragraph
  if (matched.length > 0) {
    const paragraph = banner.paragraph;
    if (paragraph && !matched.includes(paragraph)) {
      matched.push(paragraph); // ensures experience numbers come
    }
  }

  return matched.length ? matched.join("\n") : fields.join("\n");
}