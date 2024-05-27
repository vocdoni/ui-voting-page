import { Box, Button, Text } from '@chakra-ui/react'
import { ElectionQuestionsForm, useQuestionsForm } from '@vocdoni/chakra-components'
import { useElection } from '@vocdoni/react-providers'
import { InvalidElection } from '@vocdoni/sdk'
import { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { VoteButton } from './Aside'

export const Questions = () => {
  const {
    fmethods: { setValue, reset },
  } = useQuestionsForm()
  const { t } = useTranslation()
  const { isAbleToVote, election, voted } = useElection()
  const [formErrors, setFormErrors] = useState<any>({})
  const electionRef = useRef<HTMLDivElement>(null)

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
        {!voted && (
          <>
            {' '}
            <Button
              isDisabled={!isAbleToVote}
              onClick={() => {
                reset()
                election.questions.forEach((_, i) => setValue(i.toString(), '0'))
              }}
              mb={10}
            >
              <Trans i18nKey='process.mark_all'>Votar tota la llista Òmnium 2026</Trans>
            </Button>
          </>
        )}
        <ElectionQuestionsForm
          onInvalid={(args) => {
            setFormErrors(args)
          }}
        />
        {!!Object.values(formErrors).length && (
          <Text mb={3} textAlign='center' color='red'>
            .
            {t('process.helper_error', {
              count: election.questions.length - Object.values(formErrors).length,
              count2: election.questions.length,
            })}
          </Text>
        )}
      </Box>
      {isAbleToVote && (
        <Text mb={10} textAlign='center'>
          {t('process.helper')}
        </Text>
      )}
      <Box onClick={() => setFormErrors({})}>
        <VoteButton />
      </Box>
    </>
  )
}
