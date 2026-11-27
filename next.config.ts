import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  serverExternalPackages: [
    "@huggingface/transformers",
    "sharp",
    "onnxruntime-node",
  ],

  outputFileTracingIncludes: {
    "/api/about/**": [
      "./node_modules/onnxruntime-node/**/*",
      "./node_modules/onnxruntime-common/**/*",
      "./node_modules/onnxruntime-web/**/*",
      "./node_modules/@huggingface/transformers/node_modules/**/*",
      "./node_modules/sharp/**/*",
      "./node_modules/@img/**/*",
    ],
  },
};

export default nextConfig;