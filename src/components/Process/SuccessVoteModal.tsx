import {
  Box,
  Button,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react'
import { environment, useQuestionsForm } from '@vocdoni/chakra-components'
import { useClient, useElection } from '@vocdoni/react-providers'
import { InvalidElection } from '@vocdoni/sdk'
import { PropsWithChildren, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import successImg from '/assets/spreadsheet-confirm-modal.png'
import { ShareButtonProps } from '~components/Share/ShareButton'

export const SuccessVoteModal = () => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { votesLeft, election, voted } = useElection()
  const { env } = useClient()

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

  if (!election || !voted || election instanceof InvalidElection) return null

  const verify = environment.verifyVote(env, voted)
  const url = encodeURIComponent(document.location.href)
  const caption = t('process.share_caption', { title: election?.title.default })

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} url={url} caption={caption}>
      <Trans
        i18nKey='process.success_modal.text'
        components={{
          verify: <Link href={verify} target='_blank' />,
          p: <Text mb={2} />,
        }}
      />
    </ModalComponent>
  )
}

export const MultiElectionSuccessVoteModal = () => {
  const { t } = useTranslation()
  const [votes, setVotes] = useState<string[]>([])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { election } = useElection()
  const { env } = useClient()
  const { voted, elections, loaded, isAbleToVote } = useQuestionsForm()

  useEffect(() => {
    const _votes = Object.values(elections)
      .filter(({ voted }) => voted)
      .map(({ voted }) => voted)
    if (!isAbleToVote && votes.length) {
      setVotes([])
    }
    if (!votes && loaded) {
      setVotes(_votes)
    }
    if (isAbleToVote && _votes?.length > votes.length) {
      setVotes(_votes)
      onOpen()
    }
  }, [elections, loaded, votes, isAbleToVote])

  if (!loaded || !voted || !elections || election instanceof InvalidElection) return null

  const verifiers = Object.values(elections)
    ?.filter(({ voted }) => voted)
    .map(({ voted, election }) => {
      return {
        verify: environment.verifyVote(env, voted),
        text: election.questions[0].title.default,
      }
    })

  const url = encodeURIComponent(document.location.href)
  const caption = t('process.share_caption', { title: election?.title.default })

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} url={url} caption={caption}>
      <Trans
        i18nKey='process.success_modal.multi_election_text'
        components={{
          p: <Text mb={2} />,
        }}
      />
      <Flex direction={'column'} mb={2}>
        {verifiers.map(({ verify, text }) => (
          <UnorderedList>
            <Link href={verify} target='_blank'>
              {text}
            </Link>
          </UnorderedList>
        ))}
      </Flex>
      {/*<Trans*/}
      {/*  i18nKey='process.success_modal.multi_election_share'*/}
      {/*  components={{*/}
      {/*    p: <Text mb={2} />,*/}
      {/*  }}*/}
      {/*/>*/}
    </ModalComponent>
  )
}

const ModalComponent = ({
  isOpen,
  onClose,
  children,
  ...shareBtnProps
}: { isOpen: boolean; onClose: () => void; url: string; caption: string } & ShareButtonProps & PropsWithChildren) => {
  const { t } = useTranslation()
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>
          <Text>{t('process.success_modal.title')}</Text>
          <Box bgImage={successImg} minH='210px' />
        </ModalHeader>
        <ModalBody>
          {children}
          {/*<UnorderedList listStyleType='none' display='flex' justifyContent='center' gap={6} mt={6} mb={2} ml={0}>*/}
          {/*  <ListItem>*/}
          {/*    <TwitterShare {...shareBtnProps} />*/}
          {/*  </ListItem>*/}
          {/*  <ListItem>*/}
          {/*    <FacebookShare {...shareBtnProps} />*/}
          {/*  </ListItem>*/}
          {/*  <ListItem>*/}
          {/*    <TelegramShare {...shareBtnProps} />*/}
          {/*  </ListItem>*/}
          {/*  <ListItem>*/}
          {/*    <RedditShare {...shareBtnProps} />*/}
          {/*  </ListItem>*/}
          {/*</UnorderedList>*/}
        </ModalBody>

        <ModalFooter mt={4}>
          <Button onClick={onClose} variant='primary'>
            {t('process.success_modal.btn')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
