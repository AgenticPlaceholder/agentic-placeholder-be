
import { TrueApi, testnet } from '@truenetworkio/sdk'
import { TrueConfig } from '@truenetworkio/sdk/dist/utils/cli-config'

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
    hash: '0xc31528b38a9558025d3f0f9dc82d06eb1ee04186833b978b246a6495f7e7f5ff'
  },
  algorithm: {
    id: undefined,
    path: undefined,
    schemas: []
  },
}
  