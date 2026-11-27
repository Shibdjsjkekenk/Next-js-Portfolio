import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    paragraph: {
      type: String,
      required: true,
      trim: true,
    },

    italicTitle: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
    },

    publicId: {
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

export default mongoose.models.Banner ||
  mongoose.model("Banner", bannerSchema);