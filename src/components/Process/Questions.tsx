import { Box, Button, Flex, Text } from '@chakra-ui/react'
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
  const { isAbleToVote, election, voted, connected } = useElection()
  const [formErrors, setFormErrors] = useState<any>({})
  const [showUndoBtn, setShowUndoBtn] = useState(false)
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
            <Flex ml='auto' justifyContent='end' flexDirection={{ base: 'column', sm: 'row' }} gap={3} mb={10}>
              <Button
                isDisabled={!isAbleToVote}
                onClick={() => {
                  reset()
                  setFormErrors({})
                  if (connected) setShowUndoBtn(true)
                  election.questions.forEach((_, i) => setValue(i.toString(), '0'))
                }}
              >
                <Trans i18nKey='process.mark_all'>Votar tota la llista Òmnium 2026</Trans>
              </Button>
              {showUndoBtn && isAbleToVote && (
                <Button
                  bgColor='white'
                  color='black'
                  border='1px solid black'
                  _hover={{ bgColor: '#f2f2f2' }}
                  isDisabled={!isAbleToVote}
                  onClick={() => {
                    reset()
                    setShowUndoBtn(false)
                    setFormErrors({})
                  }}
                >
                  <Trans i18nKey='process.undo'>Deseleccionar</Trans>
                </Button>
              )}
            </Flex>
            <Text as='h1' color='#FF6320' fontSize='32px' fontWeight='extrabold' mb={3}>
              Eleccions a la Junta Directiva d’Òmnium
            </Text>
            <Text mb={10}>Tria individualment els candidats que vols votar, o bé, vota en blanc</Text>
          </>
        )}
        <Box
          onClick={() => {
            setFormErrors({})
            if (connected) setShowUndoBtn(true)
          }}
          position='relative'
        >
          <ElectionQuestionsForm
            onInvalid={(args) => {
              setFormErrors(args)
            }}
          />
          {voted && (
            <Button
              as='a'
              href='https://form.jotform.com/241163398249362'
              target='_blank'
              position='absolute'
              bottom='30px'
              left='50%'
              transform='translateX(-50%)'
            >
              Inscriu-te
            </Button>
          )}
        </Box>

        {!!Object.values(formErrors).length && (
          <Text mt={10} textAlign='center' color='error'>
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
