
import { pipeline, env } from "@huggingface/transformers";

const MODEL_ID = "Xenova/all-MiniLM-L6-v2";
const EMBEDDING_DIMENSIONS = 384;

type EmbeddingModel = (
  text: string,
  options: {
    pooling: "mean";
    normalize: boolean;
  },
) => Promise<{ data: Float32Array | number[] }>;

let modelPromise: Promise<EmbeddingModel> | null = null;

// Allow model download from Hugging Face Hub.
// No Inference Provider API credits required.
env.allowRemoteModels = true;

async function getEmbeddingModel(): Promise<EmbeddingModel> {
  if (!modelPromise) {
    modelPromise = pipeline(
      "feature-extraction",
      MODEL_ID,
      { dtype: "q8" },
    ) as Promise<EmbeddingModel>;

    modelPromise = modelPromise.catch((error) => {
      modelPromise = null;
      console.error("Embedding model loading failed:", error);
      throw error;
    });
  }

  return modelPromise;
}

// HTML → clean text
function cleanHTML(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function prepareAIFields(content: string) {
  if (typeof content !== "string") {
    throw new Error("AI content must be a string.");
  }

  const plainText = cleanHTML(content);

  if (!plainText) {
    return {
      plainText: "",
      embedding: [] as number[],
    };
  }

  try {
    const model = await getEmbeddingModel();

    const output = await model(plainText, {
      pooling: "mean",
      normalize: true,
    });

    const embedding = Array.from(output.data) as number[];

    if (
      embedding.length !== EMBEDDING_DIMENSIONS ||
      !embedding.every(Number.isFinite)
    ) {
      throw new Error(
        `Invalid embedding dimensions: ${embedding.length}`,
      );
    }

    return {
      plainText,
      embedding,
    };
  } catch (error: any) {
    console.error("Local embedding error:", error);

    throw new Error(
      `Local embedding generation failed: ${
        error?.message || "Unknown error"
      }`,
    );
  }
}
