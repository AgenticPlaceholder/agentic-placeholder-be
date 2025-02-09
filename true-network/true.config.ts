
import { TrueApi, testnet } from '@truenetworkio/sdk'
import { TrueConfig } from '@truenetworkio/sdk/dist/utils/cli-config'
import {adAttestationSchema} from './schema/userAttestationSchema'
// If you are not in a NodeJS environment, please comment the code following code:
import dotenv from 'dotenv'
dotenv.config()

export const getTrueNetworkInstance = async (): Promise<TrueApi> => {
  const trueApi = await TrueApi.create(config.account.secret)

  await trueApi.setIssuer(config.issuer.hash)

  return trueApi;
}

export const config: TrueConfig = {
  network: testnet,
  account: {
    address: 'msRt6seqEf9UNr9kNvWMurJJZ671GYzv12pES4WGS93EBi9',
    secret: process.env.TRUE_NETWORK_SECRET_KEY ?? ''
  },
  issuer: {
    name: 'agentic-placeholder-issuer',
    hash: '0xea1d3e711cee08ab926c7d973df37215ab47ae36b7cdd2d1aba1318948ff8bc1'
  },
  algorithm: {
    id: 154,
    path: 'acm',
    schemas: [adAttestationSchema]
  },
}
  