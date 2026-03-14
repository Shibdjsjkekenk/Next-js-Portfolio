import AboutUs from "@/models/AboutUs";

export async function buildAboutRAG(question: string) {
  try {
    const about = await AboutUs.findOne({ isActive: true }).lean();

    if (!about) {
      return "No about information available.";
    }

    const context = `
ABOUT INFORMATION

Content:
${about.content}

Resume:
${about.resume ? about.resume : "No resume provided"}

Image:
${about.image ? about.image : "No image available"}
`;

    return context;
  } catch (error) {
    console.error("About RAG error:", error);
    return "";
  }
}