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
// an existing password, unless a reset is requested:
//   npm run seed:admin -- --reset     (command line)
//   RESET_ADMIN_PASSWORD=true         (environment variable, e.g. on Render)
export async function ensureAdmin() {
  const reset =
    process.argv.includes("--reset") || process.env.RESET_ADMIN_PASSWORD === "true";

  const existing = await User.findOne({ email: ADMIN_EMAIL }).select("+password");

  if (existing) {
    let changed = false;

    if (existing.role !== "admin") {
      existing.role = "admin";
      changed = true;
      console.log(`Existing user ${ADMIN_EMAIL} promoted to admin.`);
    }

    if (reset) {
      existing.password = await bcrypt.hash(ADMIN_PASSWORD, 10);
      changed = true;
      console.log(`Password for ${ADMIN_EMAIL} reset to the configured ADMIN_PASSWORD.`);
    }

    if (changed) {
      await existing.save();
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