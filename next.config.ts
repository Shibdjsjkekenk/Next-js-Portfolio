import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  serverExternalPackages: [
    "@huggingface/transformers",
    "sharp",
    "onnxruntime-node",
  ],
};

export default nextConfig;