// src/models/Operator.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IOperator extends Document {
    name: string;
    location: string;
    walletAddress: string;
    timing: string;
    operatorLogo: string;
    priceRange: string;
    createdAt: Date;
    updatedAt: Date;
}

const operatorSchema = new Schema<IOperator>(
    {
        name: {
            type: String,
            required: [true, 'Operator name is required'],
            trim: true
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true
        },
        walletAddress: {
            type: String,
            required: [true, 'Wallet address is required'],
            trim: true,
            unique: true,  
            lowercase: true 
        },
        timing: {
            type: String,
            required: [true, 'Timing is required'],
            trim: true
        },
        operatorLogo: {
            type: String,
            required: [true, 'Operator logo URL is required'],
            trim: true
        },
        priceRange: {
            type: String,
            required: [true, 'Price range is required'],
            trim: true
        }
    },
    {
        timestamps: true,
        collection: 'operator'
    }
);


export const Operator = mongoose.model<IOperator>('operator', operatorSchema);
export default Operator;