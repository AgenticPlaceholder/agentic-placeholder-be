// src/models/Attestations.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IAttestation extends Document {
    hash: string;
    attestationType:'user-rating' | 'publisher-agent-ad-created' ;
    publisherAddress: string;
    operatorAddress: string;
    adId: number;
}

const attestationSchema = new Schema<IAttestation>(
    {
        hash: {
            type: String,
            required: [true, 'Transaction Hash is required'],
            trim: true
        },
        attestationType: {
            type: String,
            enum: ['user-rating', 'publisher-agent-ad-created'],
        },
        publisherAddress: {
            type: String,
            required: [true, 'Publisher address is required']
        },
        operatorAddress: {
            type: String,
            required: [true, 'Operator address is required']
        },
        adId: {
            type: Number,
            required: [true, 'AdId is required'],
        },
    },
    {
        timestamps: true,
        collection: 'attestations'
    }
);


attestationSchema.index({ hash: 1 });
export const Attestation = mongoose.model<IAttestation>('Attestation', attestationSchema);