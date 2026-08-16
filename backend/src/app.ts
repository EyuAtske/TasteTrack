import express from "express";
import cors from "cors";
import path from "path"; // 👈 ADD THIS IMPORT AT THE TOP
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

//  Imported routes from restaurant and review modules
import restaurantRoutes from './routes/restaurant.routes';
import reviewRoutes from './routes/review.routes'

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images statically from the 'uploads' directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// mounted routes for restaurant and review modules
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reviews', reviewRoutes);

app.get("/", (_, res) => {
    res.json({ message: "TasteTrack API is running" });
});

export default app;