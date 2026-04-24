import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    content: {
      type: String, // FULL RICH TEXT HTML
      required: true,
    },

    projectLink: {
      type: String,
      required: true,
      trim: true,
    },

    projectImage: {
      type: String, // Cloudinary / URL
      required: true,
    },

    plainText: {
      type: String,
    },

    embedding: {
      type: [Number],
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);