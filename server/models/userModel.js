// server/models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // plain-text
  role: { type: String, required: true }, // "admin" or "employee"
  profileImage: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// ❌ REMOVE bcrypt password hashing
// ❌ NO userSchema.pre("save", ...) here

const User = mongoose.model("User", userSchema);
export default User;
