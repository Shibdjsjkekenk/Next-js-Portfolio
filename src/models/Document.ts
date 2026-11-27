import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    type: {
      type: String, // "timeline" | "banner" | "project" | "about"
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    plainText: {
      type: String,
    },

    embedding: {
      type: [Number],
    },

    metadata: {
      type: Object, // optional (category, etc.)
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Document ||
  mongoose.model("Document", documentSchema);