import { Router } from 'express';
import {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} from './restaurant.controller';

const router = Router();

router.route('/')
    .get(getRestaurants)
    .post(createRestaurant); // Note: Member 1 will add Admin Auth middleware here later

router.route('/:id')
    .get(getRestaurantById)
    .put(updateRestaurant)
    .delete(deleteRestaurant);

export default router;