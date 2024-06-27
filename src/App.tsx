import { ColorModeScript } from '@chakra-ui/react'
import { ClientProvider } from '@vocdoni/chakra-components'
import { EnvOptions } from '@vocdoni/sdk'
import { Signer } from 'ethers'
import { useTranslation } from 'react-i18next'
import { useAccount, useWalletClient } from 'wagmi'
import { VocdoniEnvironment } from '~constants'
import { translations } from '~i18n/components'
import { walletClientToSigner } from '~util/wagmi-adapters'
import { RoutesProvider } from './router'

export const App = () => {
  const { data } = useWalletClient()
  const { address } = useAccount()
  const { t } = useTranslation()

  let signer = null
  if (data && address && data.account.address === address) {
    signer = walletClientToSigner(data)
  }

  return (
    <ClientProvider env={VocdoniEnvironment as EnvOptions} signer={signer as Signer} locale={translations(t)}>
      <RoutesProvider />
      <ColorModeScript />
    </ClientProvider>
  )
}
