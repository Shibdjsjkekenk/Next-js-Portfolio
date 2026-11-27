import Document from "@/models/Document";

const EMBEDDING_DIMENSIONS = 384;

/**
 * Browser-generated embeddings are passed to this server function.
 * The server does not download or initialize an embedding model.
 */
function validateEmbedding(embedding: number[]): void {
  if (!Array.isArray(embedding)) {
    throw new Error("Query embedding is required");
  }

  if (embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Invalid query embedding dimensions: ${embedding.length}`
    );
  }

  if (!embedding.every((value) => Number.isFinite(value))) {
    throw new Error("Query embedding contains invalid values");
  }
}

/**
 * Search MongoDB Atlas Vector Search and build the RAG context.
 *
 * @param question Original user question (used for validation/logging only).
 * @param embedding 384-dimensional embedding generated in the browser.
 * @param type Optional document type filter: banner, about, timeline,
 *             project, experience, etc.
 */
export async function getRAGContext(
  question: string,
  embedding: number[],
  type?: string
): Promise<{ text: string; projectIds: string[] }> {
  try {
    if (typeof question !== "string" || !question.trim()) {
      throw new Error("Question cannot be empty");
    }

    validateEmbedding(embedding);

    const vectorSearch: Record<string, any> = {
      index: "vector_index",
      path: "embedding",
      queryVector: embedding,
      numCandidates: 50,
      limit: 50,
    };

    // Keep the document-type filter in Atlas Vector Search.
    if (type) {
      vectorSearch.filter = { type };
    }

    const aggregationPipeline = [
      {
        $vectorSearch: vectorSearch,
      },
      {
        $project: {
          plainText: 1,
          type: 1,
          isActive: 1,
          metadata: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ];

    const results = await Document.aggregate(
  aggregationPipeline as any[]
);

    if (!results.length) {
      return { text: "", projectIds: [] };
    }

    // Preserve the existing behavior: only explicitly active documents
    // are included in the generated context.
    const activeResults = results.filter(
      (item: any) => item.isActive === true
    );

    if (!activeResults.length) {
      return { text: "", projectIds: [] };
    }

    const grouped: Record<string, string[]> = {};

    for (const item of activeResults) {
      if (!item.type || !item.plainText) continue;

      if (!grouped[item.type]) {
        grouped[item.type] = [];
      }

      grouped[item.type].push(item.plainText);
    }

    const context = Object.entries(grouped)
      .map(([docType, texts]) => {
        return `${docType.toUpperCase()}:\n${texts.join("\n")}`;
      })
      .join("\n\n");

    const projectIds = activeResults
      .filter((item: any) => item.type === "project")
      .map((item: any) => item.metadata?.projectId)
      .filter(Boolean)
      .map((id: any) => id.toString());

    return {
      text: context.trim(),
      projectIds: [...new Set(projectIds)],
    };
  } catch (error) {
    console.error(
      `RAG Vector Search Error [${type || "all"}]:`,
      error
    );

    return {
      text: "",
      projectIds: [],
    };
  }
}
