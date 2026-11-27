import type { NextConfig } from "next";

const nativeFiles = [
  // Hugging Face ka Sharp package
  "./node_modules/@huggingface/transformers/node_modules/sharp/**/*",

  // Nested Linux Sharp binaries
  "./node_modules/@huggingface/transformers/node_modules/@img/sharp-linux-x64/**/*",
  "./node_modules/@huggingface/transformers/node_modules/@img/sharp-libvips-linux-x64/**/*",

  // Root Linux Sharp binaries
  "./node_modules/sharp/**/*",
  "./node_modules/@img/sharp-linux-x64/**/*",
  "./node_modules/@img/sharp-libvips-linux-x64/**/*",

  // ONNX runtime: sirf Linux x64 native files
  "./node_modules/onnxruntime-node/bin/napi-v*/linux/x64/**/*",
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