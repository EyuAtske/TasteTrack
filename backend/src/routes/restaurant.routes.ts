import { Router } from 'express';
import {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} from '../controllers/restaurant.controller';

import { protect, admin } from "../middleware/auth.middleware";

const router = Router();

router.route('/')
    .get(getRestaurants)
    .post(protect, admin, createRestaurant);

router.route('/:id')
    .get(getRestaurantById)
    .put(protect, admin, updateRestaurant)
    .delete(protect, admin, deleteRestaurant);

export default router;