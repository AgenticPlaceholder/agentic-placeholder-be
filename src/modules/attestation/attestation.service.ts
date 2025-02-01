import { getTrueNetworkInstance } from '../../../true-network/true.config';
import { adAttestationSchema } from '../../../true-network/schema/userAttestationSchema';

export const attestationService = {

    attest: async function(attestationData: any) {

        console.log('Received attestation on file:', attestationData);
            
        const api = await getTrueNetworkInstance();

        const adAttestationOutput = await adAttestationSchema.attest(api, attestationData.userAddress, {
            rating: attestationData.rating,
        });
        console.log(adAttestationOutput)
        await api.network.disconnect()
    }

};
