import { Box, Button, Flex, IconButton, Text } from '@chakra-ui/react'
import { ElectionQuestionsForm, useQuestionsForm } from '@vocdoni/chakra-components'
import { useElection } from '@vocdoni/react-providers'
import { InvalidElection } from '@vocdoni/sdk'
import { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { FaUndo } from 'react-icons/fa'
import { VoteButton } from './Aside'

export const Questions = () => {
  const {
    fmethods: { setValue, reset, getValues },
  } = useQuestionsForm()
  const { t } = useTranslation()
  const { isAbleToVote, election, voted } = useElection()
  const [formErrors, setFormErrors] = useState<any>({})
  const electionRef = useRef<HTMLDivElement>(null)
  console.log(formErrors)
  // Move the focus of the screen to the first unanswered question
  useEffect(() => {
    if (!Object.keys(formErrors).length) return

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

  if (!election || election instanceof InvalidElection) return null
  return (
    <>
      <Box ref={electionRef} className='md-sizes' mb={voted ? '40px' : '100px'} pt='25px'>
        <Flex ml='auto' justifyContent='end' flexDirection='row' gap={3}>
          {!voted && (
            <IconButton
              aria-label='desmarcar totes les opcions'
              icon={<FaUndo />}
              bgColor='white'
              color='black'
              border='1px solid black'
              _hover={{ bgColor: '#f2f2f2' }}
              isDisabled={!isAbleToVote}
              onClick={() => {
                reset()
                setFormErrors({})
              }}
              mb={10}
              ml='auto'
            />
          )}
          {!voted && (
            <Button
              isDisabled={!isAbleToVote}
              onClick={() => {
                reset()
                setFormErrors({})
                election.questions.forEach((_, i) => setValue(i.toString(), '0'))
              }}
              mb={10}
            >
              <Trans i18nKey='process.mark_all'>Votar tota la llista Òmnium 2026</Trans>
            </Button>
          )}
        </Flex>
        <Box onClick={() => setFormErrors({})}>
          <ElectionQuestionsForm
            onInvalid={(args) => {
              setFormErrors(args)
            }}
          />
        </Box>
        {!!Object.values(formErrors).length && (
          <Text mt={10} textAlign='center' color='red'>
            .
            {t('process.helper_error', {
              count: election.questions.length - Object.values(formErrors).length,
              count2: election.questions.length,
            })}
          </Text>
        )}
        {isAbleToVote && (
          <Text mt={10} textAlign='center'>
            {t('process.helper')}
          </Text>
        )}
      </Box>

      <Box onClick={() => setFormErrors({})}>
        <VoteButton />
      </Box>
    </>
  )
}
