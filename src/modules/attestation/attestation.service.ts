import { getTrueNetworkInstance } from '../../../true-network/true.config';
import { adAttestationSchema } from '../../../true-network/schema/userAttestationSchema';
import {Attestation} from '../../models/attestation';
export const attestationService = {

    attest: async function(attestationData: any) {
        console.log('Received attestation on file:', attestationData);       
        const api = await getTrueNetworkInstance();
        const adAttestationOutput = await adAttestationSchema.attest(api, attestationData.publisherAddress, {
            rating: attestationData.rating,
            userAddress: attestationData.userAddress,
        });
        console.log('Prism URL:', adAttestationOutput.prismUrl);
        console.log('transactionHash:', adAttestationOutput.transaction.hash);
        console.log('Explorer URL:', adAttestationOutput.transaction.explorerUrl);
        await Attestation.create({
            hash: adAttestationOutput.transaction.hash,
            attestationType: 'user-rating',
            publisherAddress: attestationData.publisherAddress,
            operatorAddress: attestationData.operatorAddress,
            adId: attestationData.adId,
        });
        await api.network.disconnect()
    }

};
