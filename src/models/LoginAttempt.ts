import mongoose from "mongoose";

const loginAttemptSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

loginAttemptSchema.index(
  { ip: 1, email: 1 },
  { unique: true }
);

export default mongoose.models.LoginAttempt ||
  mongoose.model("LoginAttempt", loginAttemptSchema);