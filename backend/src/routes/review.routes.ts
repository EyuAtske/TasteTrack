import { Router } from 'express';
import {
    createReview,
    updateReview,
    deleteReview,
    getRestaurantReviews
} from '../controllers/review.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Note: The API plan specifies POST /api/reviews
router.route('/restaurants/:id/reviews').get(getRestaurantReviews);
router.route('/')
    .post(protect, createReview); 

router.route('/:id')
    .put(protect, updateReview)
    .delete(protect, deleteReview);

// Nested route for getting reviews of a specific restaurant

export default router;