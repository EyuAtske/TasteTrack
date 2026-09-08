import { Router } from 'express';
import {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    searchRestaurants,   
    filterRestaurants    
} from '../controllers/restaurant.controller';

import { getRestaurantReviews } from '../controllers/review.controller'; 
import { protect, admin } from '../middleware/auth.middleware';
import { uploadRestaurantImages } from '../middleware/upload.middleware';

const router = Router();

router.get('/search', searchRestaurants);
router.get('/filter', filterRestaurants);


router.route('/')
    .get(getRestaurants)
    .post(protect, admin, uploadRestaurantImages.array('images', 5), createRestaurant);

router.route('/:id')
    .get(getRestaurantById)
    .put(protect, admin, uploadRestaurantImages.array('images', 5), updateRestaurant)
    .delete(protect, admin, deleteRestaurant);

router.get('/:id/reviews', getRestaurantReviews);

export default router;