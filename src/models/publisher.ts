// src/models/Publisher.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPublisher extends Document {

        name: string;
        walletAddress: string;
        logo: string;
        reputationScore: number;
    createdAt: Date;
    updatedAt: Date;
}

const publisherSchema = new Schema<IPublisher>(
    {
            name: {
                type: String,
                required: [true, 'Publisher name is required'],
                trim: true
            },
            walletAddress: {
                type: String,
                required: [true, 'Wallet address is required'],
                unique: true,
                trim: true
            },
            logo: {
                type: String,
                required: [true, 'Logo URL is required'],
                trim: true
            },
            reputationScore: {
                type: Number,
                required: [true, 'RC is required'],
                trim: true
            }
    },
    {
        timestamps: true,
        collection: 'publisher'

    }
);

// Create indexes
publisherSchema.index({ 'publisherInfo.walletAddress': 1 });

export const Publisher = mongoose.model<IPublisher>('Publisher', publisherSchema);
export default Publisher;