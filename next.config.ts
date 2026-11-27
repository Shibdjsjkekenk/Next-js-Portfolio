import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  serverExternalPackages: [
    "@huggingface/transformers",
    "sharp",
  ],

  outputFileTracingIncludes: {
  "/api/about/*": [
    "./node_modules/@huggingface/transformers/node_modules/sharp/**/*",
    "./node_modules/@huggingface/transformers/node_modules/@img/**/*",
    "./node_modules/sharp/**/*",
    "./node_modules/@img/**/*",
  ],
},
};

export default nextConfig;