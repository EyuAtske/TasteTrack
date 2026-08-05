import { Router } from 'express';
import {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} from '../controllers/restaurant.controller';

const router = Router();

router.route('/')
    .get(getRestaurants)
    .post(createRestaurant);

router.route('/:id')
    .get(getRestaurantById)
    .put(updateRestaurant)
    .delete(deleteRestaurant);

export default router;