import { Request, Response, NextFunction } from 'express';
import Restaurant from '../models/restaurant.model';

export const getRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
    } catch (error) {
        next(error);
    }
};

export const getRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        next(error);
    }
};

export const createRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json({ success: true, data: restaurant });
    } catch (error) {
        next(error);
    }
};

export const updateRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        next(error);
    }
};

export const deleteRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
        res.status(200).json({ success: true, message: 'Restaurant deleted' });
    } catch (error) {
        next(error);
    }
};