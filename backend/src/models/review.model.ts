import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    restaurant: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number;
    title: string;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
    {
        restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Refs Member 1's User model
        rating: { type: Number, required: true, min: 1, max: 5 },
        title: { type: String, required: true, trim: true },
        comment: { type: String, required: true },
    },
    { timestamps: true } // Provides the 'createdAt' field required by the plan
);

// Optional: Prevent duplicate reviews from the same user for the same restaurant
ReviewSchema.index({ restaurant: 1, user: 1 }, { unique: true });

export default mongoose.model<IReview>('Review', ReviewSchema);