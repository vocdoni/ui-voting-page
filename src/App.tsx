import { ColorModeScript } from '@chakra-ui/react'
import { ClientProvider } from '@vocdoni/chakra-components'
import { EnvOptions } from '@vocdoni/sdk'
import { Signer } from 'ethers'
import { useTranslation } from 'react-i18next'
import { useWalletClient } from 'wagmi'
import { VocdoniEnvironment } from '~constants'
import { translations } from '~i18n/components'
import { clientToSigner } from '~util/wagmi-adapters'
import { RoutesProvider } from './router'

export const App = () => {
  const { t } = useTranslation()


  return (
    <ClientProvider env={VocdoniEnvironment as EnvOptions} locale={translations(t)}>
      <RoutesProvider />
      <ColorModeScript />
    </ClientProvider>
  )
}
