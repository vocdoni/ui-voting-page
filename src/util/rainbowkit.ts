import { connectorsForWallets, Wallet } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { coinbaseWallet, metaMaskWallet, rainbowWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets'
import { configureChains, createConfig } from 'wagmi'
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  eos,
  fantom,
  gnosis,
  goerli,
  hardhat,
  localhost,
  mainnet,
  optimism,
  polygon,
  polygonMumbai,
  polygonZkEvm,
  zkSync,
  zora,
} from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

export const { chains, publicClient } = configureChains(
  [
    mainnet,
    arbitrum,
    avalanche,
    base,
    bsc,
    eos,
    fantom,
    gnosis,
    goerli,
    hardhat,
    localhost,
    optimism,
    polygon,
    polygonMumbai,
    polygonZkEvm,
    zkSync,
    zora,
  ],
  [publicProvider()]
)

const appName = 'Vocdoni UI Scaffold'
const projectId = '641a1f59121ad0b519cca3a699877a08'

type WalletGroup = {
  groupName: string
  wallets: Wallet[]
}

const featuredConnectors = () => {
  const web3: WalletGroup = {
    groupName: 'Popular',
    wallets: [
      metaMaskWallet({ chains, projectId }),
      rainbowWallet({ projectId, chains }),
      coinbaseWallet({ chains, appName }),
      walletConnectWallet({ chains, projectId }),
    ],
  }

  return [web3]
}

const connectors = connectorsForWallets(featuredConnectors())

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})
