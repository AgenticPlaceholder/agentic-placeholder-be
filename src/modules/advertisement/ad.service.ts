import {Ad} from '../../models/ad';

export const adService = {
    publishAd: async function(data: any) {
        try {   
            await Ad.create(data);
        } catch (error) {
            console.error('Error ', error);
            throw error;
        }
    },
};


