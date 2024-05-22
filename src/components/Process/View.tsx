import {
  Box,
  Button,
  Flex,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import { ElectionQuestions, environment, SpreadsheetAccess, useConfirm } from '@vocdoni/chakra-components'
import { useClient, useElection } from '@vocdoni/react-providers'
import { ElectionResultsTypeNames, PublishedElection } from '@vocdoni/sdk'
import { useEffect, useRef, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { IoWarningOutline } from 'react-icons/io5'
import { VocdoniAppURL } from '~constants'
import { VoteButton } from './Aside'
import Header from './Header'
import omniumLogoHeader from '/assets/omnium-logo.png'
import omniumLogo from '/assets/omnium.png'

export const ProcessView = () => {
  const { t } = useTranslation()
  const { isAbleToVote, connected } = useElection()
  const electionRef = useRef<HTMLDivElement>(null)
  const [formErrors, setFormErrors] = useState<any>(null)
  const [numErrors, setNumErrors] = useState<number>(0)
  const [numQuestions, setNumQuestions] = useState(0)

  useEffect(() => {
    const form = electionRef?.current?.getElementsByTagName('form')

    if (form) {
      setNumQuestions(form[0].children.length)
    }
  }, [electionRef.current])

  // Move the focus of the screen to the first unanswered question
  useEffect(() => {
    if (!formErrors) {
      setNumErrors(0)
      return
    }

    setNumErrors(Object.keys(formErrors).length)

    // We gather all the inputs
    const inputs = electionRef?.current?.getElementsByTagName('input')

    if (inputs) {
      const inputsArray = Array.from(inputs)

      // The formErrors object has keys that represent the error names, so we filter the inputsArray with the names of the inputs
      const inputsError = inputsArray.filter((el) => el.name === Object.keys(formErrors)[0])

      // We get the last input which is the closest to the error message
      const lastInputError = inputsError[inputsError.length - 1]

      // Once we have the first input, we calculate the new position
      const newPosition = window.scrollY + lastInputError.getBoundingClientRect().top - 200

      // We move the focus to the corresponding height
      window.scrollTo({
        top: newPosition,
        behavior: 'smooth',
      })
    }
  }, [formErrors])

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

        {connected && (
          <Box>
            <SpreadsheetAccess />
          </Box>
        )}
      </Flex>
      <Header />

      <Box ref={electionRef} mb='50px' pt='25px'>
        <ElectionQuestions
          onInvalid={(args) => {
            setFormErrors(args)
          }}
          confirmContents={(election, answers) => <ConfirmVoteModal election={election} answers={answers} />}
        />
      </Box>
      {!!numErrors && (
        <Text mb={3} textAlign='center' color='red'>
          .{t('process.helper_error', { count: numQuestions - numErrors, count2: numQuestions })}
        </Text>
      )}
      {isAbleToVote && (
        <Text mb={10} textAlign='center'>
          {t('process.helper')}
        </Text>
      )}
      <Box position='sticky' bottom={0} left={0} pb={1} pt={1} onClick={() => setFormErrors(0)}>
        <VoteButton />
      </Box>

      <SuccessVoteModal />
    </>
  )
}

const SuccessVoteModal = () => {
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

  if (!election || !voted) return null

  const verify = environment.verifyVote(env, voted)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text>{t('process.success_modal.title')}</Text>
          <Box bgImage={omniumLogo} width='200px' mx='auto' />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Trans
            i18nKey='process.success_modal.text'
            components={{
              verify: <Link href={verify} target='_blank' />,
              p: <Text mb={2} />,
            }}
          />
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

const ConfirmVoteModal = ({ election, answers }: { election: PublishedElection; answers: FieldValues }) => {
  const { t } = useTranslation()
  const styles = useMultiStyleConfig('ConfirmModal')
  const { cancel, proceed } = useConfirm()

  const canAbstain =
    election.resultsType.name === ElectionResultsTypeNames.MULTIPLE_CHOICE && election.resultsType.properties.canAbstain

  return (
    <>
      <ModalHeader>
        <Text textAlign='center'>{t('process.spreadsheet.confirm.description')}</Text>
      </ModalHeader>
      <ModalBody display='flex' flexDirection='column' gap={5} p={0} mb={2}>
        <Flex
          flexDirection='column'
          maxH='400px'
          overflowY='scroll'
          boxShadow='rgba(128, 128, 128, 0.42) 1px 1px 1px 1px'
          px={2}
          borderRadius='lg'
        >
          {election.questions.map((q, i) => (
            <Box key={i} mb={2} mt={i === 0 ? 4 : 0}>
              <Text display='flex' flexDirection='row' gap={1} mb={1}>
                <Trans
                  i18nKey='process.spreadsheet.confirm.question'
                  components={{
                    span: <Text as='span' fontWeight='bold' whiteSpace='nowrap' />,
                  }}
                  values={{
                    question: q.title.default,
                    answer: q.choices[Number(answers[i])].title.default,
                    number: i + 1,
                  }}
                />
              </Text>
            </Box>
          ))}
        </Flex>
        {canAbstain && answers[0].length < election.voteType.maxCount! && (
          <Flex direction={'row'} py={2} gap={2} alignItems={'center'} color={'primary.main'}>
            <IoWarningOutline />
            <Text display='flex' flexDirection='column' gap={1}>
              {t('process.spreadsheet.confirm.abstain_count', {
                count: election.voteType.maxCount! - answers[0].length,
              })}
            </Text>
          </Flex>
        )}
      </ModalBody>
      <ModalFooter sx={styles.footer}>
        <Button onClick={cancel!} variant='ghost' sx={styles.cancel}>
          {t('cc.confirm.cancel')}
        </Button>
        <Button onClick={proceed!}>{t('cc.confirm.confirm')}</Button>
      </ModalFooter>
    </>
  )
}
