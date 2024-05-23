import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { ElectionQuestions, SpreadsheetAccess } from '@vocdoni/chakra-components'
import { useElection } from '@vocdoni/react-providers'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VocdoniAppURL } from '~constants'
import { VoteButton } from './Aside'
import { ConfirmVoteModal } from './ConfirmVoteModal'
import Header from './Header'
import { SuccessVoteModal } from './SuccessVoteModal'
import omniumLogoHeader from '/assets/omnium-logo.png'

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
