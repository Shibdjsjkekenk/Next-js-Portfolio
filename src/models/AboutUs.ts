import mongoose from "mongoose";

const AboutUsSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    plainText: {
      type: String,
    },

    embedding: {
      type: [Number],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.AboutUs ||
  mongoose.model("AboutUs", AboutUsSchema);