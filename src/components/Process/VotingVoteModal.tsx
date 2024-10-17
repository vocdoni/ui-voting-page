import { useTranslation } from 'react-i18next'
import { useElection } from '@vocdoni/react-providers'
import { Modal, ModalBody, ModalContent, ModalOverlay, Spinner, Text, VStack } from '@chakra-ui/react'

const VotingVoteModal = () => {
  const { t } = useTranslation()
  const {
    loading: { voting },
  } = useElection()

  return (
    <Modal isOpen={voting} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent p='30px !important'>
        <ModalBody>
          <VStack>
            <Spinner color='process.spinner' mb={5} w={10} h={10} />
          </VStack>
          <Text textAlign='center'>{t('process.voting')}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default VotingVoteModal
