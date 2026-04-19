import mongoose from "mongoose";

const TimelineSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String, // FULL RICH TEXT HTML
      required: true,
    },

    plainText: {
      type: String,
    },

    embedding: {
      type: [Number], // array of numbers
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

export default mongoose.models.Timeline ||
  mongoose.model("Timeline", TimelineSchema);