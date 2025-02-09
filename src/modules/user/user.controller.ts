import { Request, Response } from 'express';
import { avsService } from '../avs-agent/avs-agent.service';

interface AttestationData {
    publisherAddress: string;
    operatorAddress: string;
    rating: number;
    comment: string;
    userAddress: string;
    signature: string;
}
import { userService } from './user.service';

export const attest = async (req: Request, res: Response) => {
    try {
        const attestationData: AttestationData = req.body;
        res.json({
            success: true,
            message : "Data submitted successully"
        });
        await avsService.createTask(attestationData.comment, attestationData.rating);
        await userService.addRating(attestationData);
        await userService.attestUser(attestationData);
    } catch (error) {
        console.error('Attestation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};