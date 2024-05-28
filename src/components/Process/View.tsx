import { Box, Link, Modal, ModalBody, ModalContent, ModalOverlay, Spinner, Text, VStack } from '@chakra-ui/react'
import { Wallet } from '@ethersproject/wallet'
import { QuestionsFormProvider } from '@vocdoni/chakra-components'
import { useClient, useElection } from '@vocdoni/react-providers'
import { ArchivedElection, VocdoniSDKClient } from '@vocdoni/sdk'
import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ConfirmVoteModal } from './ConfirmVoteModal'
import Header from './Header'
import { Questions } from './Questions'
import { SuccessVoteModal } from './SuccessVoteModal'

export const ProcessView = () => {
  const {
    connected,
    election,
    client: electionClient,
    setClient: setElectionClient,
    voted,
    loading: { voting },
  } = useElection()
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
          <Text textAlign='center' mb={5}>
            <Trans
              i18nKey='process.omnium_link.you_know'
              components={{
                link: <Link href='https://form.jotform.com/241433006383347' target='_blank' color='#FF6320' />,
              }}
            />
          </Text>

          <Text textAlign='center'>
            <Trans
              i18nKey='process.omnium_link.assembly'
              components={{
                link: <Link href='https://form.jotform.com/241163398249362' target='_blank' color='#FF6320' />,
              }}
            />
          </Text>
        </Box>
      )}
      <VotingVoteModal />
      <SuccessVoteModal />
    </>
  )
}
const VotingVoteModal = () => {
  const { t } = useTranslation()
  const {
    loading: { voting },
  } = useElection()

  return (
    <Modal isOpen={voting} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <VStack>
          <Spinner color='#FF6320' mb={5} w={10} h={10} />
        </VStack>
        <ModalBody>
          <Text>{t('process.voting')}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
