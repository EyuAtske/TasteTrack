import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import Restaurant from '../models/restaurant.model';
import Review from '../models/review.model';

export const getDashboardStats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = (req as any).user.id;

        const [
            totalRestaurants,
            totalUsers,
            totalReviews,
            recentReviews,
            user,
            userReviewsCount,
        ] = await Promise.all([
            Restaurant.countDocuments(),
            User.countDocuments(),
            Review.countDocuments(),

            Review.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('user', 'name profileImage')
                .populate('restaurant', 'name'),

            User.findById(userId).select(
                'name role favorites'
            ),

            Review.countDocuments({
                user: userId,
            }),
        ]);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const dashboardData = {
            platformStats: {
                totalRestaurants,
                totalUsers,
                totalReviews,
            },

            recentActivity: recentReviews,

            userStats: {
                name: user.name,
                role: user.role,
                favoritesCount: user.favorites.length,
                reviewsCount: userReviewsCount,
            },
        };

        return res.status(200).json({
            success: true,
            data: dashboardData,
        });
    } catch (error) {
        next(error);
    }
};