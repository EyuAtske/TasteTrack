import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';       // Adjust path if needed
import Restaurant from '../models/restaurant.model'; // Adjust path if needed
import Review from '../models/review.model';   // Adjust path if needed

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Get general platform statistics
        const totalRestaurants = await Restaurant.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalReviews = await Review.countDocuments();

        // 2. Get recent reviews (last 5) with populated user and restaurant details
        const recentReviews = await Review.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name profileImage')
            .populate('restaurant', 'name');

        // 3. Prepare the response object
        const dashboardData: any = {
            platformStats: {
                totalRestaurants,
                totalUsers,
                totalReviews
            },
            recentActivity: recentReviews
        };

        // 4. If the user is logged in, add their personal stats
        if ((req as any).user) {
            const userId = (req as any).user.id;
            const user = await User.findById(userId);
            
            if (user) {
                const userReviewsCount = await Review.countDocuments({ user: userId });
                
                dashboardData.userStats = {
                    name: user.name,
                    role: user.role,
                    favoritesCount: user.favorites.length,
                    reviewsCount: userReviewsCount
                };
            }
        }

        res.status(200).json({ success: true, data: dashboardData });
    } catch (error) {
        next(error);
    }
};