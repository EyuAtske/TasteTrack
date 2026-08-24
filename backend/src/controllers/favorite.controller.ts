import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import Restaurant from '../models/restaurant.model';

// GET FAVORITES
export const getFavorites = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = (req as any).user.id;

        const user = await User.findById(userId).populate(
            'favorites',
            'name description address category cuisine priceRange images averageRating'
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            count: user.favorites.length,
            data: user.favorites,
        });
    } catch (error) {
        next(error);
    }
};

// ADD FAVORITE
export const addFavorite = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = (req as any).user.id;
        const { restaurantId } = req.body;

        if (!restaurantId) {
            return res.status(400).json({
                success: false,
                message: 'Restaurant ID is required',
            });
        }

        if (!mongoose.isValidObjectId(restaurantId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid restaurant ID',
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const restaurantExists = await Restaurant.exists({
            _id: restaurantId,
        });

        if (!restaurantExists) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found',
            });
        }

        const restaurantObjectId =
            new mongoose.Types.ObjectId(restaurantId);

        const alreadyFavorite = user.favorites.some(
            (favorite) => favorite.equals(restaurantObjectId)
        );

        if (alreadyFavorite) {
            return res.status(400).json({
                success: false,
                message: 'Restaurant is already in favorites',
            });
        }

        user.favorites.push(restaurantObjectId);

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Restaurant added to favorites',
            data: user.favorites,
        });
    } catch (error) {
        next(error);
    }
};

// REMOVE FAVORITE
export const removeFavorite = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = (req as any).user.id;
        const { id: restaurantId } = req.params;

        if (!mongoose.isValidObjectId(restaurantId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid restaurant ID',
            });
        }

        const restaurantObjectId =
            new mongoose.Types.ObjectId(restaurantId);

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    favorites: restaurantObjectId,
                },
            },
            {
                new: true,
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Restaurant removed from favorites',
            data: user.favorites,
        });
    } catch (error) {
        next(error);
    }
};