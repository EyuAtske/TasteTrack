import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';
import Review from '../models/review.model';
import Restaurant from '../models/restaurant.model';

const updateRestaurantAverageRating = async (
    restaurantId: mongoose.Types.ObjectId
) => {
    const stats = await Review.aggregate([
        {
            $match: {
                restaurant: restaurantId,
            },
        },
        {
            $group: {
                _id: '$restaurant',
                averageRating: {
                    $avg: '$rating',
                },
            },
        },
    ]);

    const averageRating =
        stats.length > 0 ? Number(stats[0].averageRating.toFixed(2)) : 0;

    await Restaurant.findByIdAndUpdate(
        restaurantId,
        { averageRating },
        { runValidators: true }
    );
};

// CREATE REVIEW
export const createReview = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { restaurant, rating, title, comment } = req.body;
        const userId = req.user!._id.toString();

        if (!mongoose.isValidObjectId(restaurant)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid restaurant ID',
            });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5',
            });
        }

        if (!title?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Review title is required',
            });
        }

        if (!comment?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Review comment is required',
            });
        }

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid user ID',
            });
        }

        const restaurantExists = await Restaurant.exists({
            _id: restaurant,
        });

        if (!restaurantExists) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found',
            });
        }

        const existingReview = await Review.findOne({
            restaurant,
            user: userId,
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this restaurant',
            });
        }

        const newReview = await Review.create({
            restaurant,
            user: userId,
            rating,
            title: title.trim(),
            comment: comment.trim(),
        });

        await updateRestaurantAverageRating(
            newReview.restaurant
        );

        const populatedReview = await newReview.populate(
            'user',
            'name profileImage'
        );

        return res.status(201).json({
            success: true,
            data: populatedReview,
        });
    } catch (error: any) {
        // Protect against a race condition with the unique index.
        if (error?.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this restaurant',
            });
        }

        next(error);
    }
};

// GET RESTAURANT REVIEWS
export const getRestaurantReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid restaurant ID',
            });
        }

        const reviews = await Review.find({
            restaurant: id,
        })
            .populate('user', 'name profileImage')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE REVIEW
export const updateReview = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { rating, title, comment } = req.body;
        const userId = req.user!._id.toString();

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid review ID',
            });
        }

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        if (review.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review',
            });
        }

        if (rating !== undefined && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5',
            });
        }

        if (title !== undefined && !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Review title cannot be empty',
            });
        }

        if (comment !== undefined && !comment.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Review comment cannot be empty',
            });
        }

        review.rating = rating ?? review.rating;
        review.title = title !== undefined
            ? title.trim()
            : review.title;
        review.comment = comment !== undefined
            ? comment.trim()
            : review.comment;

        await review.save();

        await updateRestaurantAverageRating(review.restaurant);

        const populatedReview = await review.populate(
            'user',
            'name profileImage'
        );

        return res.status(200).json({
            success: true,
            data: populatedReview,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE REVIEW
export const deleteReview = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const userId = req.user!._id.toString();

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid review ID',
            });
        }

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        if (review.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review',
            });
        }

        const restaurantId = review.restaurant;

        await review.deleteOne();

        await updateRestaurantAverageRating(restaurantId);

        return res.status(200).json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};