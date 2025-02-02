import { Request, Response } from 'express';

export const getDashboardDetails = async (req: Request, res: Response) => {
    try {
       
        res.json({
            success: true,
            data : {
                publisherInfo : {
                    name : 'Publisher ',
                    walletAddress : '0x180c5f2aBF35442Fb4425A1edBF3B5faDFc2208D',
                    logo : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',      
                },
               AdInfo : [
                {
                    adTitle : 'Ad Title',
                    adDescription : 'Ad Description',
                    adImage : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',
                    repuationScore : '4.5',
                    operatorDetails : {
                        name : 'Operator 1',
                        location : 'Lagos',
                        walletAddress : '0x180c5f2aBF35442Fb4425A1edBF3B5faDFc2208D',
                        timing : '9am - 5pm',
                        operatorLogo : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',
                    },
                    reputationScore : '4.5',
                    moneySpent : '1000',
                    userScores : [
                        {
                            stars: 5,
                            count: 10
                        },
                        {
                            stars: 3,
                            count: 2
                        }
                    ]
                },
               ]
            }
        });
       
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};