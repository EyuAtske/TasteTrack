import express from "express";
import cors from "cors";
import path from "path"; 

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

import restaurantRoutes from './routes/restaurant.routes';
import reviewRoutes from './routes/review.routes';
import favoriteRoutes from './routes/favorite.routes'; 

// 1. ADDED: Import the dashboard routes
import dashboardRoutes from './routes/dashboard.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images statically from the 'uploads' directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Mounted routes for restaurant, review, favorite, and dashboard modules
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);

// 2. ADDED: Register the dashboard routes
app.use('/api/dashboard', dashboardRoutes);

app.get("/", (_, res) => {
    res.json({ message: "TasteTrack API is running" });
});

export default app;