import {
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useElection } from '@vocdoni/react-providers'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import omniumLogo from '/assets/omnium-logo.png'

export const SuccessVoteModal = () => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { votesLeft, election, voted } = useElection()
  const [vLeft, setVLeft] = useState<number>(0)

  useEffect(() => {
    if (!vLeft && votesLeft >= 0) {
      setVLeft(votesLeft)
    }

    if (vLeft && votesLeft < vLeft) {
      setVLeft(votesLeft)
      onOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [votesLeft, vLeft])

  if (!election || !voted) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Image src={omniumLogo} alt='omnium logo' w='100%' mb={10} mt={5} />
          <Text>{t('process.success_modal.title')}</Text>
        </ModalHeader>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  )
}
