import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Restaurant from '../models/restaurant.model';

const getPagination = (req: Request) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const currentPage = Number.isInteger(page) && page > 0 ? page : 1;
    const itemsPerPage =
        Number.isInteger(limit) && limit > 0
            ? Math.min(limit, 50)
            : 10;

    return {
        page: currentPage,
        limit: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
    };
};

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
        const { page, limit, skip } = getPagination(req);

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

        if (!query || typeof query !== 'string' || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required',
            });
        }

        const searchQuery = query.trim();

        // Escape regex special characters so user input is treated as text
        const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(escapedQuery, 'i');

        const { page, limit, skip } = getPagination(req);

        const filter = {
            $or: [
                { name: searchRegex },
                { cuisine: searchRegex },
                { description: searchRegex },
            ],
        };

        const [restaurants, total] = await Promise.all([
            Restaurant.find(filter)
                .select('name cuisine priceRange averageRating images address')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Restaurant.countDocuments(filter),
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

//  FILTER restaurants (by category, priceRange, minRating)
export const filterRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category, priceRange, minRating } = req.query;

        const filter: Record<string, unknown> = {};

        // Category validation
        if (category !== undefined) {
            if (typeof category !== 'string' || !category.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid category',
                });
            }

            filter.category = category.trim();
        }

        // Price range validation
        const validPriceRanges = ['$', '$$', '$$$', '$$$$'];

        if (priceRange !== undefined) {
            if (
                typeof priceRange !== 'string' ||
                !validPriceRanges.includes(priceRange)
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid price range',
                });
            }

            filter.priceRange = priceRange;
        }

        // Minimum rating validation
        if (minRating !== undefined) {
            const rating = Number(minRating);

            if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'minRating must be a number between 0 and 5',
                });
            }

            filter.averageRating = { $gte: rating };
        }

        const { page, limit, skip } = getPagination(req);

        const [restaurants, total] = await Promise.all([
            Restaurant.find(filter)
                .select('name category cuisine priceRange averageRating images address')
                .sort({ averageRating: -1 })
                .skip(skip)
                .limit(limit),

            Restaurant.countDocuments(filter),
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