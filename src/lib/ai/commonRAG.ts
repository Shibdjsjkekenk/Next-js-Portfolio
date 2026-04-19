import { InferenceClient } from "@huggingface/inference";
import Document from "@/models/Document";

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export async function getRAGContext(
  question: string,
  type?: string // optional: "timeline" | "banner" | "project"
) {
  try {
    // 🔥 1. Question → embedding
    const queryVectorRaw = await client.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: question,
    });

    const embedding: number[] = Array.isArray(queryVectorRaw)
      ? (queryVectorRaw as any).flat().map((v: any) => Number(v))
      : [];

    if (!embedding.length) return "";

    // 🔥 2. Build pipeline
    const pipeline: any[] = [
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: embedding,
          numCandidates: 50,
          limit: 8, // thoda zyada for better mix
        },
      },
    ];

    // 🔥 optional filter by type
    if (type) {
      pipeline[0].$vectorSearch.filter = { type };
    }

    // 🔥 3. project fields
    pipeline.push({
      $project: {
        plainText: 1,
        type: 1,
        isActive: 1,
        score: { $meta: "vectorSearchScore" },
      },
    });

    const results = await Document.aggregate(pipeline);

    if (!results.length) return "";

    // 🔥 4. Smart filtering
    const maxScore = results[0].score;
    const threshold = maxScore * 0.6;

    let filtered = results.filter(
      (item) =>
        item.score >= threshold &&
        item.isActive !== false
    );

    if (!filtered.length) {
      filtered = results;
    }

    // 🔥 5. Group by type (better structure)
    const grouped: Record<string, string[]> = {};

    filtered.forEach((item) => {
      if (!grouped[item.type]) {
        grouped[item.type] = [];
      }
      grouped[item.type].push(item.plainText);
    });

    // 🔥 6. Convert to structured text
    let context = "";

    Object.entries(grouped).forEach(([type, texts]) => {
      context += `\n${type.toUpperCase()}:\n`;
      context += texts.join("\n");
      context += "\n";
    });

    return context.trim();

  } catch (error) {
    console.error("Common RAG Error:", error);
    return "";
  }
}