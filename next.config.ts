import type { NextConfig } from "next";

const nativeFiles = [
  "./node_modules/onnxruntime-node/**/*",
  "./node_modules/@huggingface/transformers/node_modules/sharp/**/*",
  "./node_modules/@huggingface/transformers/node_modules/@img/sharp-linux-x64/**/*",
  "./node_modules/@huggingface/transformers/node_modules/@img/sharp-libvips-linux-x64/**/*",
];

const nextConfig: NextConfig = {
  reactCompiler: true,

  serverExternalPackages: [
    "@huggingface/transformers",
    "sharp",
    "onnxruntime-node",
  ],

  outputFileTracingIncludes: {
    "/api/about/update/[id]": nativeFiles,
    "/api/about/create": nativeFiles,
  },
};

export default nextConfig;