import { providers } from 'ethers'
import { useMemo } from 'react'
import type { Account, Chain } from 'viem'
import { Config, useConnectorClient } from 'wagmi'
import { ExternalProvider, JsonRpcFetchFunc } from '@ethersproject/providers'

type CustomClient = {
  transport: ExternalProvider | JsonRpcFetchFunc
  chain: Chain
  account: Account
}

export function clientToSigner(client: CustomClient) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}

/** Hook to convert a Viem Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}
