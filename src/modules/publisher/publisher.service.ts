import logger from '../../config/logger';
import { Publisher, IPublisher } from '../../models/publisher';

export const publisherService = {
    getPublisherDetailsbyWalletAddress : async function(walletAddress: string) {
        try {
            const operator = await Publisher.findOne({ 
                walletAddress 
            });
            return operator;
        } catch (error) {
            logger.error('Error fetching operator:', error);
            throw error;
        }
    },

    getAdInfo: async function(walletAddress: string) {
        try {
            const result = await Publisher.aggregate([
                { $match: { walletAddress } },
                // Get basic publisher info first
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        walletAddress: 1,
                        logo: 1,
                        reputationScore: 1
                    }
                },
                // Separate pipeline for AdInfo
                {
                    $lookup: {
                        from: 'ads',
                        let: { publisherWallet: '$walletAddress' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$publisherAddress', '$$publisherWallet'] }
                                }
                            },
                            // Lookup operator details for each ad
                            {
                                $lookup: {
                                    from: 'operator',
                                    localField: 'operatorAddress',
                                    foreignField: 'walletAddress',
                                    as: 'operatorDetails'
                                }
                            },
                            // Lookup ratings for each ad
                            {
                                $lookup: {
                                    from: 'ratings',
                                    localField: 'publisherAddress',
                                    foreignField: 'publisherAddress',
                                    as: 'ratings'
                                }
                            },
                            // Transform the data into desired format
                            {
                                $project: {
                                    adId: 1,
                                    tokenId: 1,
                                    adTitle: 1,
                                    adDescription: 1,
                                    adImage: 1,
                                    moneySpent: 1,
                                    operatorDetails: {
                                        $let: {
                                            vars: {
                                                operator: { $arrayElemAt: ['$operatorDetails', 0] }
                                            },
                                            in: {
                                                name: '$$operator.name',
                                                location: '$$operator.location',
                                                walletAddress: '$$operator.walletAddress',
                                                timing: '$$operator.timing',
                                                operatorLogo: '$$operator.operatorLogo'
                                            }
                                        }
                                    },
                                    userScores: {
                                        $map: {
                                            input: [5, 4, 3, 2, 1],
                                            as: 'stars',
                                            in: {
                                                stars: '$$stars',
                                                count: {
                                                    $size: {
                                                        $filter: {
                                                            input: '$ratings',
                                                            cond: { $eq: ['$$this.rating', '$$stars'] }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        ],
                        as: 'AdInfo'
                    }
                }
            ]);

            return result[0].AdInfo;
        } catch (error) {
            logger.error('Error fetching ads:', error);
            throw error;
        }
    },
}
