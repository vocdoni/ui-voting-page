import { useCallback, useState } from 'react'
import { useClient, useElection } from '@vocdoni/react-providers'
import { VocdoniSDKClient } from '@vocdoni/sdk'
import { Wallet } from 'ethers'
import { Button } from '@chakra-ui/react'
import { Trans } from 'react-i18next'

const BlindCSPConnect = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { env } = useClient()
  const { election, setClient, connected, client: cl } = useElection()
  const connect = useCallback(() => {
    setIsLoading(true)
    try {
      setClient(
        new VocdoniSDKClient({
          env,
          wallet: Wallet.createRandom(),
          electionId: election?.id,
        })
      )
    } catch (e) {
      console.warn('Error trying to login with private key ', e)
      // this should not be required... if it fails, the client should already be the one set
      setClient(cl)
    } finally {
      setIsLoading(false)
    }
  }, [env, election?.id])

  return (
    <>
      {(!cl.wallet || Object.keys(cl.wallet).length === 0) && (
        <Button w={'full'} onClick={connect} isLoading={isLoading}>
          <Trans i18nKey={'blindcsp.connect'}>Demo connect</Trans>
        </Button>
      )}
    </>
  )
}

export default BlindCSPConnect
