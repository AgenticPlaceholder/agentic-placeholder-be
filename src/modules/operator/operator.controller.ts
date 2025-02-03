import { Request, Response } from 'express';
import { getOperatorDetailsbyWalletAddress } from './operator.service';
import logger from '../../config/logger';

export const getOperatorDetails = async (req: Request, res: Response) => {
    try {
        logger.info('getOperatorDetails');
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
       
        res.json({
            success: true,
            data : {
                publisherInfo : {
                    name : 'Publisher ',
                    walletAddress : '0x180c5f2aBF35442Fb4425A1edBF3B5faDFc2208D',
                    logo : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',      
                },
                AdInfo : {
                    adTitle : 'Ad Title',
                    adDescription : 'Ad Description',
                    adImage : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',
                    repuationScore : '4.5',
                }   
            }
        });
       
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}