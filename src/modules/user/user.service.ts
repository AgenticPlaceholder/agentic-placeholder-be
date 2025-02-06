import { attestationService } from '../attestation/attestation.service';
import { Rating } from '../../models/rating';

export const userService = {
    attestUser: async function(data: any) {
        try {
            await attestationService.attest(data);
        } catch (error) {
            console.error('Error attesting on True Network:', error);
            throw error;
        }
    },
    addRating: async function(data: any) {
        try {
            await Rating.create({
                adId: data.adId,
                publisherAddress: data.publisherAddress,
                userAddress: data.userAddress,
                rating: data.rating,
                comment: data.comment,
            });
        } catch (error) {
            console.error('Error adding rating:', error);
            throw error;
        }
    }
    
};


