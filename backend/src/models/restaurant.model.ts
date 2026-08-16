import mongoose, { Schema, Document } from 'mongoose';

// Define the TypeScript interface
export interface IRestaurant extends Document {
    name: string;
    description: string;
    address: string;
    category: string;
    cuisine: string;
    priceRange: string;
    images: string[];
    contact: string;
    openingHours: string; // Can be upgraded to an object later if needed
    averageRating: number;
    latitude: number;
    longitude: number;
}

// Create the Schema
const RestaurantSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        address: { type: String, required: true },
        category: { type: String, required: true },
        cuisine: { type: String, required: true },
        priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'], required: true },
        images: [{ type: String, default: [], }], // Array of image URLs
        contact: { type: String },
        openingHours: { type: String },
        averageRating: { type: Number, default: 0, min: 0, max: 5 },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    { timestamps: true } // Automatically manages createdAt and updatedAt
);

export default mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);