import { Request, Response } from 'express';
import { auctionService } from './auction.service';

export const startAuction = async (req: Request, res: Response) => {
    try {
       let response = await auctionService.startAuction();
         res.json({
              success: true,
              data : response
         });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const bid = async (req: Request, res: Response) => {
    try {
        const { tokenId, bidAmount } = req.body;
       let response = await auctionService.placeBid(tokenId, bidAmount);
         res.json({
              success: true,
              data : response
         });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const endAuctionNoBids = async (req: Request, res: Response) => {
    try {
       
       let response = await auctionService.endAuctionNoBids();
         res.json({
              success: true,
              data : response
         });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};