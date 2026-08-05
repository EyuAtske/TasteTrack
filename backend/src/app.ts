import express from "express";
import cors from "cors";

//  Imported routes from restaurant and review modules

import restaurantRoutes from './modules/restaurant/restaurant.routes';
import reviewRoutes from './modules/review/review.routes'

const app = express();

app.use(cors());
app.use(express.json());

// mounted routes for restaurant and review modules
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reviews', reviewRoutes);

app.get("/", (_, res) => {
    res.json({ message: "TasteTrack API is running" });
});

export default app;