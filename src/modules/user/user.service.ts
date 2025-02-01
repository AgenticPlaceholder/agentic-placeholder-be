import { attestationService } from '../attestation/attestation.service';

export const userService = {
    attestUser: async function(data: any) {
        try {
            await attestationService.attest(data);
        } catch (error) {
            console.error('Error attesting on True Network:', error);
            throw error;
        }
    }
};


