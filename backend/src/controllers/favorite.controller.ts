import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model'; // Adjust path if needed

// 1. GET current user's favorite restaurants
export const getFavorites = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;

        // Find the user and populate the 'favorites' array with actual Restaurant data
        const user = await User.findById(userId).populate({
            path: 'favorites',
            model: 'Restaurant' // Ensure this matches your Restaurant model name
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, count: user.favorites.length, data: user.favorites });
    } catch (error) {
        next(error);
    }
};

// 2. ADD a restaurant to favorites
export const addFavorite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const { restaurantId } = req.body;

        if (!restaurantId) {
            return res.status(400).json({ success: false, message: 'Restaurant ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if already in favorites
        if (user.favorites.includes(restaurantId)) {
            return res.status(400).json({ success: false, message: 'Restaurant is already in favorites' });
        }

        // Add to favorites array and save
        user.favorites.push(restaurantId);
        await user.save();

        res.status(200).json({ success: true, message: 'Restaurant added to favorites', data: user.favorites });
    } catch (error) {
        next(error);
    }
};

// 3. REMOVE a restaurant from favorites
export const removeFavorite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const restaurantId = req.params.id; // The ID passed in the URL

        // Use MongoDB's $pull to remove the ID from the array
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: restaurantId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'Restaurant removed from favorites', data: user.favorites });
    } catch (error) {
        next(error);
    }
};