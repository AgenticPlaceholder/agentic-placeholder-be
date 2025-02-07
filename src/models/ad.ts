import mongoose, { Document, Schema } from 'mongoose';

export interface IAd extends Document {
    adId : number;
    adTitle: string;
    adDescription: string;
    adImage: string;
    moneySpent: number;
    status: 'active' | 'inactive' ;
    publisherAddress: string;
    operatorAddress: string;
    createdAt: Date;
    updatedAt: Date;
}

// Main Ad schema
const adSchema = new Schema<IAd>(
    {
        adId: {
            type: Number,
            required: [true, 'Ad ID is required'],
        },
        adTitle: {
            type: String,
            required: [true, 'Ad title is required'],
            trim: true,
            maxlength: [100, 'Ad title cannot be more than 100 characters']
        },
        adDescription: {
            type: String,
            required: [true, 'Ad description is required'],
            trim: true,
            maxlength: [1000, 'Ad description cannot be more than 1000 characters']
        },
        adImage: {
            type: String,
            required: [true, 'Ad image URL is required'],
            trim: true
        },
        moneySpent: {
            type: Number,
            required: [true, 'Money spent is required'],
            min: 0,
            default: 0
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'inactive',
            required: true
        },
        publisherAddress: {
            type: String,
            required: [true, 'Publisher address is required']
        },
        operatorAddress: {
            type: String,
            required: [true, 'Operator address is required']
        }
    },
    {
        timestamps: true,
        collection: 'ads'
    }
);

// Indexes for better query performance
adSchema.index({ publisherAddress: 1, operatorAddress: 1});

export const Ad = mongoose.model<IAd>('Ads', adSchema);
