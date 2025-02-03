import { Request, Response } from 'express';
import { getPublisherDetailsbyWalletAddress } from './publisher.service';

export const getDashboardDetails = async (req: Request, res: Response) => {
    try {
        const walletAddress = req.query.walletAddress  as string;
        const publisher = await getPublisherDetailsbyWalletAddress(walletAddress.toLowerCase());
        res.json({
            success: true,
            data : {
                publisherInfo : publisher,
               AdInfo : [
                {
                    adTitle : 'Ad Title',
                    adDescription : 'Ad Description',
                    adImage : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',
                    operatorDetails : {
                        name : 'Operator 1',
                        location : 'Lagos',
                        walletAddress : '0x180c5f2aBF35442Fb4425A1edBF3B5faDFc2208D',
                        timing : '9am - 5pm',
                        operatorLogo : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',
                    },
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
                {
                    adTitle : 'Ad Title 2 ',
                    adDescription : 'Ad Description',
                    adImage : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',
                    operatorDetails : {
                        name : 'Operator 2',
                        location : 'Lagos',
                        walletAddress : '0xe4Ef40Cf518B216Ce96e4B89Da654FE96D4cC6ca',
                        timing : '1am - 3pm',
                        operatorLogo : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',
                    },
                    moneySpent : '500',
                    userScores : [
                        {
                            stars: 5,
                            count: 4
                        },
                        {
                            stars: 3,
                            count: 2
                        },
                        {
                            stars: 2,
                            count: 10
                        }
                    ]
                },
                {
                    adTitle : 'Ad Title 3',
                    adDescription : 'Ad Description 3',
                    adImage : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',
                    operatorDetails : {
                        name : 'Operator 1',
                        location : 'Lagos',
                        walletAddress : '0x180c5f2aBF35442Fb4425A1edBF3B5faDFc2208D',
                        timing : '9am - 5pm',
                        operatorLogo : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',
                    },
                    moneySpent : '2000',
                    userScores : [
                        {
                            stars: 5,
                            count: 10
                        },
                        {
                            stars: 3,
                            count: 40
                        },
                        {
                            stars: 4,
                            count: 25
                        },
                        {
                            stars: 2,
                            count: 2
                        }
                    ]
                },
                {
                    adTitle : 'Ad Title 4',
                    adDescription : 'Ad Description 4',
                    adImage : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',
                    operatorDetails : {
                        name : 'Operator 3',
                        location : 'Lagos',
                        walletAddress : '0x180c5f2aBF35442Fb4425A1edBF3B5faDFc2208D',
                        timing : '9am - 5pm',
                        operatorLogo : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',
                    },
                    moneySpent : '20',
                    userScores : [
                        {
                            stars: 3,
                            count: 2
                        }
                    ]
                },
                {
                    adTitle : 'Ad Title 5',
                    adDescription : 'Ad Description 5',
                    adImage : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',
                    operatorDetails : {
                        name : 'Operator 4',
                        location : 'Lagos',
                        walletAddress : '0x180c5f2aBF35442Fb4425A1edBF3B5faDFc2208D',
                        timing : '11am - 1pm',
                        operatorLogo : 'https://placeholderads.s3.ap-south-1.amazonaws.com/pol.JPG',
                    },
                    moneySpent : '100',
                    userScores : [
                        {
                            stars: 3,
                            count: 10
                        },
                        {
                            stars: 2,
                            count: 20
                        },
                        {
                            stars: 1,
                            count: 5
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