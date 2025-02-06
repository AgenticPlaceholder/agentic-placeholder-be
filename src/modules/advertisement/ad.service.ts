import {Ad} from '../../models/ad';

export const adService = {
    publishAd: async function(data: any) {
        try {   
          // First, update all existing active ads for this operator to inactive
        const updateResult = await Ad.updateMany(
            { 
                operatorAddress: data.operatorAddress,
                status: 'active'
            },
            { 
                status: 'inactive'
            }
        );
        // Create new ad regardless of whether any documents were updated
        await Ad.create(data);
        
        } catch (error) {
            console.error('Error ', error);
            throw error;
        }
    },
    getActiveAd: async function(operatorWalletAddress: string) {
        try {   
            const result = await Ad.aggregate([
                // Match active ad
                {
                    $match: { 
                        status: 'active',
                        operatorAddress: operatorWalletAddress
                    }
                },
                // Lookup publisher details
                {
                    $lookup: {
                        from: 'publisher',
                        localField: 'publisherAddress',
                        foreignField: 'walletAddress',
                        as: 'publisher'
                    }
                },
                // Unwind publisher array
                {
                    $unwind: '$publisher'
                },
                // Format the output
                {
                    $project: {
                        _id: 0,
                        publisherInfo: {
                            _id: '$publisher._id',
                            name: '$publisher.name',
                            walletAddress: '$publisher.walletAddress',
                            logo: '$publisher.logo',
                            reputationScore: '$publisher.reputationScore'
                        },
                        AdInfo: {
                            adTitle: '$adTitle',
                            adDescription: '$adDescription',
                            adImage: '$adImage',
                        }
                    }
                }
            ]);
    return result[0];

        } catch (error) {
            console.error('Error ', error);
            throw error;
        }
    },
};


