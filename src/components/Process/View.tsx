import { Box, Link, Text } from '@chakra-ui/react'
import { Wallet } from '@ethersproject/wallet'
import { QuestionsFormProvider } from '@vocdoni/chakra-components'
import { useClient, useElection } from '@vocdoni/react-providers'
import { ArchivedElection, VocdoniSDKClient } from '@vocdoni/sdk'
import { useEffect } from 'react'
import { ConfirmVoteModal } from './ConfirmVoteModal'
import Header from './Header'
import { Questions } from './Questions'
import { SuccessVoteModal } from './SuccessVoteModal'

export const ProcessView = () => {
  const { connected, election, client: electionClient, setClient: setElectionClient, voted } = useElection()
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
      <Header />

      <QuestionsFormProvider
        confirmContents={(election, answers) => <ConfirmVoteModal election={election} answers={answers} />}
      >
        <Questions />
      </QuestionsFormProvider>
      {voted && (
        <Box mb={20}>
          <Text textAlign='center'>
            Ajuda'ns a conèixer-te millor!{' '}
            <Link href='https://form.jotform.com/241433006383347' target='_blank' color='#FF6320'>
              Respon aquestes preguntes
            </Link>
          </Text>

          <Text textAlign='center'>
            Inscriu-te a l'Assemblea General a Valls{' '}
            <Link href='https://form.jotform.com/241163398249362' target='_blank' color='#FF6320'>
              aquí
            </Link>
          </Text>
        </Box>
      )}
      <SuccessVoteModal />
    </>
  )
}
