import { Schema, U64,Text } from "@truenetworkio/sdk";

// Schema for the Ad Attestation
export const adAttestationSchema = Schema.create({
    rating: U64,
    userAddress: Text
});