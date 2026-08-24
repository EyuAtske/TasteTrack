import { Request, Response, NextFunction } from 'express';
import Review from '../models/review.model'; 
import Restaurant from '../models/restaurant.model'; // Adjust this path if your file is named differently

// Helper function to recalculate and update the average rating of a restaurant
const updateRestaurantAverageRating = async (restaurantId: string) => {
    const stats = await Review.aggregate([
        { $match: { restaurant: restaurantId } },
        { $group: { _id: '$restaurant', averageRating: { $avg: '$rating' } } }
    ]);

    const avg = stats.length > 0 ? stats[0].averageRating : 0;
    await Restaurant.findByIdAndUpdate(restaurantId, { averageRating: avg });
};

// 1. CREATE a new review
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { restaurant, rating, title, comment } = req.body;
        const userId = (req as any).user.id; // Assumes Member 1's auth middleware attaches 'user' to req

        // Prevent duplicate reviews
        const existingReview = await Review.findOne({ restaurant, user: userId });
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this restaurant' });
        }

        const newReview = await Review.create({
            restaurant,
            user: userId,
            rating,
            title,
            comment
        });

        // Recalculate the restaurant's average rating
        await updateRestaurantAverageRating(restaurant);

        const populatedReview = await newReview.populate('user', 'name profileImage');
        res.status(201).json({ success: true, data: populatedReview });
    } catch (error) {
        next(error);
    }
};

// 2. GET all reviews for a specific restaurant
export const getRestaurantReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviews = await Review.find({ restaurant: req.params.id })
            .populate('user', 'name profileImage')
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        next(error);
    }
};

// 3. UPDATE a review
export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { rating, title, comment } = req.body;
        const userId = (req as any).user.id;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Ensure the user owns the review
        if (review.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
        }

        review.rating = rating ?? review.rating;
        review.title = title ?? review.title;
        review.comment = comment ?? review.comment;
        await review.save();

        // Recalculate the restaurant's average rating
        await updateRestaurantAverageRating(review.restaurant.toString());

        res.status(200).json({ success: true, data: review });
    } catch (error) {
        next(error);
    }
};

// 4. DELETE a review
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Ensure the user owns the review
        if (review.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
        }

        const restaurantId = review.restaurant.toString();
        await review.deleteOne();

        // Recalculate the restaurant's average rating after deletion
        await updateRestaurantAverageRating(restaurantId);

        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        next(error);
    }
};