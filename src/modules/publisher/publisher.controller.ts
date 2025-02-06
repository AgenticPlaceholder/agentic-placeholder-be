import { Request, Response } from 'express';
import { publisherService } from './publisher.service';

export const getDashboardDetails = async (req: Request, res: Response) => {
    try {
        const walletAddress = req.query.walletAddress  as string;
        const publisher = await publisherService.getPublisherDetailsbyWalletAddress(walletAddress.toLowerCase());
        const adInfo = await publisherService.getAdInfo(walletAddress); 
        res.json({
            success: true,
            data: {
                publisherInfo: publisher,
                AdInfo: adInfo
            },
            // data : {
            //     publisherInfo : publisher,
            //    AdInfo : [
            //     {
            //         adTitle : 'Ad Title',
            //         adDescription : 'Ad Description',
            //         adImage : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',
            //         operatorDetails : {
            //             name : 'Operator 1',
            //             location : 'Lagos',
            //             walletAddress : '0x180c5f2aBF35442Fb4425A1edBF3B5faDFc2208D',
            //             timing : '9am - 5pm',
            //             operatorLogo : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',
            //         },
            //         moneySpent : '1000',
            //         userScores : [
            //             {
            //                 stars: 5,
            //                 count: 10
            //             },
            //             {
            //                 stars: 3,
            //                 count: 2
            //             }
            //         ]
            //     },
            //    ]
            // }
        });
       
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

