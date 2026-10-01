import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.model";

// Change these here, or override them with ADMIN_* environment variables.
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@tastetrack.com")
  .trim()
  .toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";

// Creates the default admin if missing. Assumes mongoose is already connected.
// Safe to call on every start: it never creates duplicates and never changes
// an existing password.
export async function ensureAdmin() {
  const existing = await User.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log(`Existing user ${ADMIN_EMAIL} promoted to admin.`);
    } else {
      console.log(`Admin ${ADMIN_EMAIL} already exists. Nothing to do.`);
    }
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
  });

  console.log(`Admin created: ${ADMIN_EMAIL}`);
}

// Command-line usage:  npm run seed:admin
async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing required environment variable: MONGO_URI");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");

  await ensureAdmin();
}

// Only run when executed directly, NOT when server.ts imports this file.
if (require.main === module) {
  main()
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}