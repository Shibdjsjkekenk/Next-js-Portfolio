import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  deviceName: String,
  ipAddress: String,
  city: String,
  state: String,
  country: String,
  latitude: Number,
  longitude: Number,
  loggedInAt: { type: Date, default: Date.now },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  role: { type: String, default: "GENERAL" },
  loginCount: { type: Number, default: 0 },
  logins: [loginSchema],
}, { timestamps: true });

export default mongoose.models.User ||
  mongoose.model("User", userSchema);
