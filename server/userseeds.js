import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const insertAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      return process.exit(0);
    }

    // ✅ HASH the password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = new User({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword, // ✅ Save hashed password
      role: "admin",
      profileImage: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await adminUser.save();
    console.log("✅ Admin inserted successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to insert admin:", err);
    process.exit(1);
  }
};

insertAdmin();
  