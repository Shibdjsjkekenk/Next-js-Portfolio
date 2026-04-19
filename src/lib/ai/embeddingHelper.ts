import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

// HTML → clean text
function cleanHTML(html: string) {
    return html
        .replace(/<[^>]*>/g, " ")   // space add karo
        .replace(/\s+/g, " ")       // extra spaces remove
        .trim();
}

export async function prepareAIFields(content: string) {
    const plainText = cleanHTML(content);

    if (!plainText) {
        return {
            plainText: "",
            embedding: [],
        };
    }

    // HuggingFace embedding
    const response = await client.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: plainText,
    });

    // convert to flat array
    const embedding = Array.isArray(response[0])
        ? response[0]
        : response;

    return { plainText, embedding };
}