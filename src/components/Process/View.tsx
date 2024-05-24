import { Box, Button, Flex, Image } from '@chakra-ui/react'
import { Wallet } from '@ethersproject/wallet'
import { QuestionsFormProvider, SpreadsheetAccess } from '@vocdoni/chakra-components'
import { useClient, useElection } from '@vocdoni/react-providers'
import { ArchivedElection, VocdoniSDKClient } from '@vocdoni/sdk'
import { useEffect } from 'react'
import { VocdoniAppURL } from '~constants'
import { ConfirmVoteModal } from './ConfirmVoteModal'
import Header from './Header'
import { Questions } from './Questions'
import { SuccessVoteModal } from './SuccessVoteModal'
import omniumLogoHeader from '/assets/omnium-logo.png'

export const ProcessView = () => {
  const { connected, election, client: electionClient, setClient: setElectionClient } = useElection()
  const { env, setClient, client, setSigner } = useClient()

  const shouldRender = !(election instanceof ArchivedElection)

  const privkey = window.location.hash ? window.location.hash.split('#')[1] : ''

  // In case of spreadsheet census and a private provided through the URI, do intent to login automatically
  // Example url with private key:
  // https://vote.omnium.cat/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef#0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
  useEffect(() => {
    ;(async () => {
      try {
        if (!shouldRender || connected) return
        if (privkey) {
          const privKeyWallet = new Wallet(privkey)
          let newClient = new VocdoniSDKClient({
            env,
            wallet: privKeyWallet,
            electionId: election?.id,
          })
          let clientAddress =
            client.wallet && client.wallet instanceof Wallet ? await client.wallet?.getAddress() : null
          let electionClientAddress =
            electionClient.wallet && electionClient.wallet instanceof Wallet
              ? await electionClient.wallet?.getAddress()
              : null
          let walletAddress = await newClient.wallet?.getAddress()
          if (!!!client.wallet || clientAddress !== walletAddress) {
            setClient(newClient)
            setSigner(privKeyWallet)
          }
          if (!!!electionClient.wallet || electionClientAddress !== walletAddress) {
            setElectionClient(newClient)
          }
        }
      } catch (error) {
        console.warn('Error trying to login with private key ', error)
        // setClient(electionClient)
      }
    })()
  }, [election, env, shouldRender, privkey])

  return (
    <>
      <Flex justifyContent='end' alignItems='center' gap={1} mb={{ base: 5, lg2: 8 }}>
        <Image
          src={omniumLogoHeader}
          maxW={{ base: '150px', md: '250px', lg: '300px' }}
          mr='auto'
          h='auto'
          alt='omnium logo'
        />

        <a href={VocdoniAppURL}>
          <Button bgColor='white' color='black' boxShadow='2px 2px 2px 2px lightgray' _hover={{ bgColor: '#f1f1f1' }}>
            Admin
          </Button>
        </a>

      </Flex>
      <Header />

      <QuestionsFormProvider
        confirmContents={(election, answers) => <ConfirmVoteModal election={election} answers={answers} />}
      >
        <Questions />
      </QuestionsFormProvider>
      <SuccessVoteModal />
    </>
  )
}
