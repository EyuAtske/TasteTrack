import dotenv from "dotenv";
dotenv.config();

import "./config/env";

import app from "./app";
import { connectDB } from "./config/db";
import { autoSeedOrSync } from "./seed/seedRestaurants";
import { ensureAdmin } from "./seed/seedAdmin";

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectDB();

        try {
            await ensureAdmin();
        } catch (err) {
            console.error("Admin seed failed:", err);
        }
        await autoSeedOrSync();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

startServer();