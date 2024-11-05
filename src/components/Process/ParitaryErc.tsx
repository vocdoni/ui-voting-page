import {
  ElectionQuestionsForm,
  ExtendedSubmitHandler,
  FormFieldValues,
  Markdown,
  SubmitFormValidation,
  useQuestionsForm,
} from '@vocdoni/chakra-components'
import { Box, chakra, Checkbox, Flex, Spinner, Stack, useMultiStyleConfig, useToast } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo } from 'react'

/**
 * File to store paritary erc project specific code
 */

export const useFormValidation = () => {
  const { t } = useTranslation()
  const toast = useToast()

  const formValidation: SubmitFormValidation = (values) => {
    const title = t('paritary_errors.title')
    const description = t('paritary_errors.description')
    if (!sameLengthValidator(values)) {
      toast({
        status: 'error',
        title: title,
        description: description,
      })
      return description
    }
    return true
  }
  return { formValidation }
}

/**
 * Check all values responses have the same length
 * Won't work for multiquestions elections.
 */
export const sameLengthValidator: SubmitFormValidation = (answers) => {
  const [first, ...rest] = Object.values(answers)
  if (!first) {
    throw new Error('No fields found')
  }
  return rest.every((ballot) => ballot[0].length === first[0].length)
}

const BlankVoteTitle = 'Vot en blanc'
type BlankChoiceStore = Record<string, string>

/**
 * Implements specific logic for blank option.
 */
export const ParitaryErcQuestionsForm = () => {
  const { elections, voteAll, isDisabled, setIsDisabled, isAbleToVote, loaded } = useQuestionsForm()

  // Search which index contain blanc options (preventing unordered choices)
  const blankOptions = useMemo(() => {
    const blankOptions: BlankChoiceStore = {}
    // Hardcode to check blankOption only when the number of elections is 2
    if (!elections || (elections && Object.keys(elections).length !== 2)) return blankOptions
    for (const { election } of Object.values(elections)) {
      for (const question of election.questions) {
        const blankChoice = question.choices.find((option) => option.title.default === BlankVoteTitle)
        if (blankChoice) {
          blankOptions[election.id] = blankChoice.value.toString()
        }
      }
    }
    return blankOptions
  }, [elections])

  const disableForm = () => {
    setIsDisabled((prevState) => !prevState)
  }

  const onSubmit: ExtendedSubmitHandler<FormFieldValues> = (onSubmit, ...params) => {
    if (!isAbleToVote) return
    // If is disabled it will create a ballot with only blank options
    if (isDisabled) {
      const blankVotes = Object.entries(blankOptions).reduce((acc, [eId, option]) => {
        acc[eId] = [[option]]
        return acc
      }, {} as FormFieldValues)
      return voteAll(blankVotes)
    }
    return onSubmit(...params)
  }

  // Hide the en blanc options using display none
  useEffect(() => {
    // Find the element with the specific text content
    const blankVoteElements = Array.from(document.querySelectorAll('label')).filter(
      (el) => el.textContent === BlankVoteTitle
    )
    if (blankVoteElements) {
      // Hide the element
      for (const element of blankVoteElements) {
        element.style.display = 'none'
      }
    }
  }, [elections])
  const styles = useMultiStyleConfig('ElectionQuestions')

  return (
    <>
      {!loaded && (
        <Flex align='center' justify='center' width={'full'}>
          <Spinner size='sm' />
        </Flex>
      )}
      <ElectionQuestionsForm onSubmit={onSubmit} />
      {loaded && (
        <chakra.div>
          <chakra.div __css={styles.wrapper}>
            <div />
            <chakra.div __css={styles.question}>
              <chakra.div __css={styles.header}>
                <chakra.label __css={styles.title}>{`${BlankVoteTitle} `}</chakra.label>
              </chakra.div>
              <chakra.div __css={styles.body}>
                <chakra.div
                  __css={styles.description}
                  sx={{
                    mb: 2,
                  }}
                >
                  <Markdown>
                    Si vols votar en blanc, trobaràs l'opció al final del formulari, si es tria aquesta opció, no es
                    tindran en compte les opcions previament seleccionades
                  </Markdown>
                </chakra.div>
                <Stack sx={styles.stack}>
                  <Checkbox checked={isDisabled} onChange={disableForm} sx={styles.checkbox} isDisabled={!isAbleToVote}>
                    <Box py={4} pl={4}>
                      Vota en blanc a les dos llistes
                    </Box>
                  </Checkbox>
                </Stack>
              </chakra.div>
            </chakra.div>
          </chakra.div>
        </chakra.div>
      )}
    </>
  )
}
