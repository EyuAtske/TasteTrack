import { Request, Response, NextFunction } from 'express';
import Review from './review.model';

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // In Week 2, you will attach req.user.id here using Member 1's Auth Middleware
        const review = await Review.create(req.body);
        res.status(201).json({ success: true, data: review });
    } catch (error) {
        next(error);
    }
};

export const getRestaurantReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviews = await Review.find({ restaurant: req.params.id }).populate('user', 'name profileImage');
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        next(error);
    }
};

// Skeletons for Update and Delete (To be fully fleshed out in Week 2/3)
export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(200).json({ message: 'Update review WIP' }); } catch (e) { next(e); }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(200).json({ message: 'Delete review WIP' }); } catch (e) { next(e); }
};