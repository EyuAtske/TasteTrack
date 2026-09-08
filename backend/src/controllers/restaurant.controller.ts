import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Restaurant from '../models/restaurant.model';

// Builds public URLs from uploaded files
const buildImageUrls = (req: Request): string[] => {
    if (!req.files || !Array.isArray(req.files)) return [];
    return (req.files as Express.Multer.File[]).map(
        (file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    );
};

//  Pagination added
export const getRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
        const skip = (page - 1) * limit;

        const [restaurants, total] = await Promise.all([
            Restaurant.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Restaurant.countDocuments(),
        ]);

        res.status(200).json({
            success: true,
            count: restaurants.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: restaurants,
        });
    } catch (error) {
        next(error);
    }
};

//  Detail API now rejects invalid IDs
export const getRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid restaurant ID' });
        }
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        next(error);
    }
};

// Handles uploaded images
export const createRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("BODY:", req.body);
        const uploadedImages = buildImageUrls(req);
        const restaurant = await Restaurant.create({
            ...req.body,
            images: uploadedImages.length > 0 ? uploadedImages : req.body.images ?? [],
        });
        res.status(201).json({ success: true, data: restaurant });
    } catch (error) {
        next(error);
    }
};

//  Invalid ID check + appends new images
export const updateRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid restaurant ID' });
        }
        const existing = await Restaurant.findById(req.params.id);
        if (!existing) return res.status(404).json({ success: false, message: 'Restaurant not found' });

        const uploadedImages = buildImageUrls(req);
        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                images: uploadedImages.length > 0
                    ? [...existing.images, ...uploadedImages]
                    : req.body.images ?? existing.images,
            },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        next(error);
    }
};

//  Invalid ID check
export const deleteRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid restaurant ID' });
        }
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
        res.status(200).json({ success: true, message: 'Restaurant deleted' });
    } catch (error) {
        next(error);
    }
};

// SEARCH restaurants (by name, cuisine, or description)
export const searchRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.query;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({ success: false, message: 'Search query is required' });
        }

        // Case-insensitive regex search across name, cuisine, and description
        const searchRegex = new RegExp(query, 'i');
        
        const restaurants = await Restaurant.find({
            $or: [
                { name: searchRegex },
                { cuisine: searchRegex },
                { description: searchRegex }
            ]
        }).select('name cuisine priceRange averageRating images address');

        res.status(200).json({ 
            success: true, 
            count: restaurants.length, 
            data: restaurants 
        });
    } catch (error) {
        next(error);
    }
};

//  FILTER restaurants (by category, priceRange, minRating)
export const filterRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category, priceRange, minRating } = req.query;

        // Build the filter object dynamically
        const filter: any = {};

        if (category) filter.category = category;
        if (priceRange) filter.priceRange = priceRange; // e.g., "$", "$$", "$$$"
        if (minRating) filter.averageRating = { $gte: Number(minRating) };

        const restaurants = await Restaurant.find(filter)
            .select('name category cuisine priceRange averageRating images address')
            .sort({ averageRating: -1 }); // Sort by highest rating first for better UX

        res.status(200).json({ 
            success: true, 
            count: restaurants.length, 
            data: restaurants 
        });
    } catch (error) {
        next(error);
    }
};