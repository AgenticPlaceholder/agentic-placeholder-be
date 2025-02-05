import { Request, Response } from 'express';
import { adService } from './ad.service';

export const publishAd = async (req: Request, res: Response) => {
    try {

        // Gets called from the agent when the bid is finalized. 
        // The agent will call this endpoint to submit the data to the blockchain

        const { adId, publisherAddress, adTitle, adDescription, adImage, operatorAddress, moneySpent } = req.body;
        req.body.status = 'active';
        // Call the service to publish the ad
        await adService.publishAd(req.body);
        res.json({
            success: true,
            message : "Ad published successully"
        });
       
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};