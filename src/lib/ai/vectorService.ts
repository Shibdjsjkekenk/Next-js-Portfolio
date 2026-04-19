import { InferenceClient } from "@huggingface/inference";
import Document from "@/models/Document";

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

// MAIN FUNCTION
export async function saveToVectorDB({
    type,
    content,
    metadata = {},
}: {
    type: string;
    content: string;
    metadata?: any;
}) {
    try {
        // clean text
        const plainText = content.replace(/\s+/g, " ").trim();

        if (!plainText) return;

        // embedding
        const queryVectorRaw = await client.featureExtraction({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            inputs: plainText,
        });

        const embedding: number[] = Array.isArray(queryVectorRaw)
            ? (queryVectorRaw as any).flat().map((v: any) => Number(v))
            : [];

        if (!embedding.length) return;

        // save in ONE collection
        await Document.create({
            type,
            content,
            plainText,
            embedding,
            metadata,
        });

    } catch (error) {
        console.error("Vector Save Error:", error);
    }
}