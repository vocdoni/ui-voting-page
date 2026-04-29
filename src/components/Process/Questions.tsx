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
      <Box
        ref={electionRef}
        className='md-sizes'
        mb={voted ? '40px' : '100px'}
        pb={isAbleToVote ? { base: '110px', md: '130px' } : 0}
        pt='25px'
      >
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
                <Trans i18nKey='process.mark_all'>Selecciona tota la llista Òmnium 2030</Trans>
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
            <Text as='h2' color='#FF6320' fontSize='32px' fontWeight='extrabold' mb={3}>
              Eleccions a la Junta Directiva d’Òmnium
            </Text>
            <Text mb={10}>
              {' '}
              <Trans i18nKey='process.helper_candidates'>
                Tria individualment els candidats que vols votar (pots marcar-los tots), o bé, vota en blanc:
              </Trans>
            </Text>
          </>
        )}
        <Box
          onClick={() => {
            setFormErrors({})
            if (connected) setShowUndoBtn(true)
          }}
        >
          <ElectionQuestionsForm
            onInvalid={(args) => {
              setFormErrors(args)
            }}
          />
        </Box>
        {voted && (
          <Flex justifyContent='center' mt={6}>
            <Button as='a' href='https://form.jotform.com/260961421326352' target='_blank'>
              Inscriu-te aquí.
            </Button>
          </Flex>
        )}

        {!!Object.values(formErrors).length && (
          <Text mt={10} textAlign='center' color='error'>
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

      <Box
        position='fixed'
        bottom={{ base: 4, md: 6 }}
        left={0}
        w='100%'
        zIndex={30}
        px={{ base: 4, md: 6 }}
        pointerEvents='none'
      >
        <Box maxW='site-width' mx='auto' onClick={() => setFormErrors({})} pointerEvents='auto'>
          <VoteButton py={0} px={0} />
        </Box>
      </Box>
    </>
  )
}
