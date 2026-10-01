import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/user.model';
import Restaurant from '../models/restaurant.model';
import Review from '../models/review.model';

export const getDashboardStats = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!._id.toString();

        const [
            totalRestaurants,
            totalUsers,
            totalReviews,
            recentReviews,
            user,
            userReviews,
        ] = await Promise.all([
            Restaurant.countDocuments(),
            User.countDocuments(),
            Review.countDocuments(),

            Review.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('user', 'name profileImage')
                .populate('restaurant', 'name'),

            User.findById(userId).populate({
                path: 'favorites',
                select: 'name description address category cuisine priceRange images averageRating reviewCount',
            }),

            Review.find({ user: userId }),
        ]);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const userReviewsCount = userReviews.length;
        const distinctVisitedCount = new Set(
            userReviews.map((r) => r.restaurant.toString())
        ).size;

        const sumUserRatings = userReviews.reduce(
            (acc, r) => acc + (r.rating || 0),
            0
        );
        const avgRatingGiven =
            userReviewsCount > 0
                ? Number((sumUserRatings / userReviewsCount).toFixed(1))
                : 0;

        const favoritesList = user.favorites || [];

        const dashboardData = {
            platformStats: {
                totalRestaurants,
                totalUsers,
                totalReviews,
            },

            recentActivity: recentReviews,

            stats: {
                totalFavorites: favoritesList.length,
                totalReviews: userReviewsCount,
                totalVisited: distinctVisitedCount,
                avgRatingGiven,
            },

            favorites: favoritesList,

            userStats: {
                name: user.name,
                role: user.role,
                favoritesCount: favoritesList.length,
                reviewsCount: userReviewsCount,
                placesVisitedCount: distinctVisitedCount,
                avgRatingGiven,
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