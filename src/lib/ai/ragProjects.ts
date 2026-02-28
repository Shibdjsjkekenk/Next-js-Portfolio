import Project from "@/models/Project";

export async function buildProjectRAG(question: string) {
  let projects = await Project.find({ isActive: true }).sort({ order: 1 });
  if (!projects.length) return { text: "", cards: [] };

  const q = question.toLowerCase();

  const isProjectQuery =
    q.includes("project") ||
    q.includes("work") ||
    q.includes("portfolio") ||
    q.includes("demo");

  if (!isProjectQuery) return { text: "", cards: [] };

  // SMART RANKING ENGINE

  // FEATURED PROJECT
  if (q.includes("best") || q.includes("featured") || q.includes("top")) {
    const featured = projects.find((p) => p.featured);
    if (featured) projects = [featured];
  }

  // LATEST PROJECT
  else if (q.includes("latest") || q.includes("recent") || q.includes("new")) {
    projects = [...projects].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  }

  // QUALITY BASED (fallback best)
  else if (q.includes("recommend") || q.includes("suggest")) {
    projects = [...projects].sort(
      (a, b) => b.content.length - a.content.length
    );
  }

  // Count detaction

  let limit = projects.length;

  const num = q.match(/\d+/);
  if (num) limit = Math.min(parseInt(num[0]), projects.length);

  if (q.includes("one") || q.includes("ek")) limit = 1;
  if (q.includes("two")) limit = 2;

  const selected = projects.slice(0, limit);

  //  OUTPUT
  const text = selected
    .map((p, i) => `Project ${i + 1}: ${stripHtml(p.content)}`)
    .join("\n");

  const cards = selected.map((p) => ({
    title: extractTitle(p.content),
    image: p.projectImage,
    link: p.projectLink,
  }));

  return { text, cards };
}

// helpers
function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "");
}

function extractTitle(html: string) {
  const clean = stripHtml(html);
  return clean.split(".")[0].slice(0, 60);
}