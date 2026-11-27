import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    content: {
      type: String, 
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Experience ||
  mongoose.model("Experience", ExperienceSchema);
