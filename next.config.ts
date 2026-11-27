import type { NextConfig } from "next";

const nativeFiles = [
  // ONNX Runtime: JavaScript entry point + Linux x64
  "./node_modules/onnxruntime-node/package.json",
  "./node_modules/onnxruntime-node/dist/**/*",
  "./node_modules/onnxruntime-node/bin/napi-v*/linux/x64/**/*",

  // ONNX common
  "./node_modules/onnxruntime-common/package.json",
  "./node_modules/onnxruntime-common/dist/**/*",

  // Hugging Face Sharp
  "./node_modules/@huggingface/transformers/node_modules/sharp/**/*",
  "./node_modules/@huggingface/transformers/node_modules/@img/sharp-linux-x64/**/*",
  "./node_modules/@huggingface/transformers/node_modules/@img/sharp-libvips-linux-x64/**/*",

  // Root Sharp
  "./node_modules/sharp/**/*",
  "./node_modules/@img/sharp-linux-x64/**/*",
  "./node_modules/@img/sharp-libvips-linux-x64/**/*",
];

const nextConfig: NextConfig = {
  reactCompiler: true,

  serverExternalPackages: [
    "@huggingface/transformers",
    "sharp",
    "onnxruntime-node",
  ],

  outputFileTracingIncludes: {
    "/api/about/**": nativeFiles,
  },
};

export default nextConfig;