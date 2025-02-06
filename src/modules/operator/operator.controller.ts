import { Request, Response } from 'express';
import { getOperatorDetailsbyWalletAddress,  } from './operator.service';
import { adService } from '../advertisement/ad.service';

export const getOperatorDetails = async (req: Request, res: Response) => {
    try {
        const walletAddress = req.query.walletAddress  as string;
        const operator = await getOperatorDetailsbyWalletAddress(walletAddress.toLowerCase());
        res.json({
            success: true,
            data: operator
        });
       
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAdDetails = async (req: Request, res: Response) => {
    try {

        const walletAddress = req.query.walletAddress  as string;
        const AdInfo = await adService.getActiveAd(walletAddress.toLowerCase());
        res.json({
            success: true,
            data : AdInfo
        });
       
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

/*
  "data": {
        "publisherInfo": {
            "_id": "67a0197670497e1fedbeccea",
            "name": "Publisher Owner",
            "walletAddress": "0x180c5f2abf35442fb4425a1edbf3b5fadfc2208d",
            "logo": "https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG",
            "reputationScore": 10
        },
        "AdInfo": {
            "adTitle": "Ad Title",
            "adDescription": "Ad Description",
            "adImage": "https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG",
            "repuationScore": "4.5"
        }
    }
        */