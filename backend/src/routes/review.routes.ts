import { Router } from 'express';
import {
    createReview,
    updateReview,
    deleteReview,
    getRestaurantReviews
} from '../controllers/review.controller';

const router = Router();

// Note: The API plan specifies POST /api/reviews
router.route('/')
    .post(createReview); 

router.route('/:id')
    .put(updateReview)
    .delete(deleteReview);

// Nested route for getting reviews of a specific restaurant
router.route('/restaurants/:id/reviews').get(getRestaurantReviews);

export default router;