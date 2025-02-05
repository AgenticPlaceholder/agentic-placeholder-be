// src/models/Rating.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
    adId: number;
    publisherAddress: string;
    userAddress: string;
    rating: number;
    isFlagged: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ratingSchema = new Schema<IRating>(
    {
        adId: {
            type: Number,
            required: [true, 'AdId is required'],
        },
        publisherAddress: {
            type: String,
            required: [true, 'Publisher address is required'],
            trim: true
        },
        userAddress: {
            type: String,
            required: [true, 'User address is required'],
            trim: true
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: 1,
            max: 5
        },
        isFlagged: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
        collection: 'ratings'
    }
);


ratingSchema.index({ publisherAddress: 1, userAddress: 1 }, { unique: true });
export const Rating = mongoose.model<IRating>('Rating', ratingSchema);