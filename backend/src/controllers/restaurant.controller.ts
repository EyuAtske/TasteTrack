import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
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
    // Use a fixed public URL: behind the Vite/Docker proxy, req.get('host') is
    // the internal name (backend:5000), which the browser cannot open.
    const publicUrl = (process.env.PUBLIC_URL || 'http://localhost:5000').replace(/\/$/, '');
    return (req.files as Express.Multer.File[]).map(
        (file) => `${publicUrl}/uploads/${file.filename}`
    );
};

// Pagination + Filter added
export const getRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, skip } = getPagination(req);
        const { search, category, priceRange, location } = req.query;

        const filter: Record<string, unknown> = {};

        if (category && typeof category === 'string' && category !== 'All') {
            filter.category = new RegExp(`^${category.trim()}$`, 'i');
        }

        if (priceRange && typeof priceRange === 'string' && priceRange !== 'All') {
            filter.priceRange = priceRange;
        }

        const searchConditions = [];

        if (typeof search === 'string' && search.trim()) {
            const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const searchRegex = new RegExp(escaped, 'i');
            searchConditions.push(
                { name: searchRegex },
                { cuisine: searchRegex },
                { description: searchRegex },
                { address: searchRegex },
                { category: searchRegex }
            );
        }

        if (typeof location === 'string' && location.trim() && location !== 'Anywhere') {
            const escapedLoc = location.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const locRegex = new RegExp(escapedLoc, 'i');
            // Check if address matches location
            filter.address = locRegex;
        }

        if (searchConditions.length > 0) {
            filter.$or = searchConditions;
        }

        const [restaurants, total] = await Promise.all([
            Restaurant.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Restaurant.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            count: restaurants.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: restaurants,
            restaurants: restaurants,
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

// Accepts contact as an object (JSON) or as flat phone/website fields (multipart forms)
const normalizeBody = (body: Record<string, any>) => {
    const { phone, website, ...rest } = body;
    if (phone !== undefined || website !== undefined) {
        const base = rest.contact && typeof rest.contact === 'object' ? rest.contact : {};
        rest.contact = { ...base, phone: phone ?? base.phone, website: website ?? base.website };
    }
    return rest;
};

// Handles uploaded images
export const createRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = normalizeBody(req.body);
        const uploadedImages = buildImageUrls(req);
        const restaurant = await Restaurant.create({
            ...body,
            images: uploadedImages.length > 0 ? uploadedImages : body.images ?? [],
        });
        res.status(201).json({ success: true, data: restaurant });
    } catch (error) {
        next(error);
    }
};

// Parse the list of image URLs the admin removed in the edit form
// (sent as a JSON string, or as a repeated field, in multipart requests)
const parseRemovedImages = (value: unknown): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) return parsed.filter((v): v is string => typeof v === 'string');
        } catch {
            return [value];
        }
    }
    return [];
};

// Delete a removed image file from disk (only files inside the uploads folder)
const deleteImageFile = (url: string) => {
    const marker = '/uploads/';
    const idx = url.indexOf(marker);
    if (idx === -1) return; // external image (e.g. Unsplash): nothing on disk
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filePath = path.normalize(path.join(uploadsDir, url.slice(idx + marker.length)));
    if (!filePath.startsWith(uploadsDir + path.sep)) return; // path safety
    fs.promises.unlink(filePath).catch(() => { /* already gone */ });
};

//  Invalid ID check + appends new images
export const updateRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid restaurant ID' });
        }
        const existing = await Restaurant.findById(req.params.id);
        if (!existing) return res.status(404).json({ success: false, message: 'Restaurant not found' });

        const { removedImages, ...body } = normalizeBody(req.body);
        const removed = parseRemovedImages(removedImages);
        const uploadedImages = buildImageUrls(req);

        // keep the existing photos the admin did not remove
        const keptImages = existing.images.filter((img) => !removed.includes(img));
        // newest upload becomes the cover photo; removals are applied even without uploads
        const images = [...uploadedImages, ...keptImages];

        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { ...body, images },
            { new: true, runValidators: true }
        );

        // clean up the removed files from disk once the database update succeeded
        existing.images.filter((img) => removed.includes(img)).forEach(deleteImageFile);

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
                { address: searchRegex },
                { category: searchRegex },
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