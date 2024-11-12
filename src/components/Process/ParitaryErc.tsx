import {
  Box,
  chakra,
  Checkbox,
  FormControl,
  FormErrorMessage,
  Flex,
  Spinner,
  Stack,
  useMultiStyleConfig,
  useToast,
} from '@chakra-ui/react'
import {
  ElectionQuestionsForm,
  ExtendedSubmitHandler,
  FormFieldValues,
  Markdown,
  useQuestionsForm,
} from '@vocdoni/chakra-components'
import { useElection } from '@vocdoni/react-providers'
import { ElectionResultsTypeNames, PublishedElection } from '@vocdoni/sdk'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FieldValues, SubmitErrorHandler, ValidateResult } from 'react-hook-form'

/**
 * File to store paritary erc project specific code
 */

export const useFormValidation = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const { fmethods } = useQuestionsForm()

  const formData = fmethods.watch()

  const { election } = useElection()

  const formValidation: () => ValidateResult | Promise<ValidateResult> = () => {
    if (!(election instanceof PublishedElection)) return null
    if (!(election && election.resultsType.name === ElectionResultsTypeNames.MULTIPLE_CHOICE)) {
      return null
    }

    if (!sameLengthValidator(formData)) {
      const title = t('paritary_errors.title')
      const description = t('paritary_errors.description', {
        max: election.resultsType?.properties?.numChoices?.max,
        min: election.resultsType?.properties?.numChoices?.min,
      })
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
export const sameLengthValidator: (values: FormFieldValues) => ValidateResult | Promise<ValidateResult> = (answers) => {
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
  const { t } = useTranslation()
  const toast = useToast()
  const { elections, isDisabled, setIsDisabled, isAbleToVote, loaded, voted } = useQuestionsForm()
  const { formValidation } = useFormValidation()
  const [globalError, setGlobalError] = useState('')
  const styles = useMultiStyleConfig('ElectionQuestions')

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
    setIsDisabled((prevState) => {
      if (!prevState) setGlobalError('')
      return !prevState
    })
  }

  const onSubmit: ExtendedSubmitHandler<FormFieldValues> = (submitHandler, ...params) => {
    if (!isAbleToVote) return
    let selectedOpts = params[0]
    // If is disabled it will create a ballot with only blank options
    if (isDisabled) {
      selectedOpts = Object.entries(blankOptions).reduce((acc, [eId, option]) => {
        acc[eId] = [[option]]
        return acc
      }, {} as FormFieldValues)
      // return voteAll(blankVotes)
    }
    // Run custom validation only if blank votes are not selected
    if (!isDisabled && formValidation) {
      const error = formValidation()
      if (typeof error === 'string' || (typeof error === 'boolean' && !error)) {
        setGlobalError(error.toString())
        return
      }
    }
    setGlobalError('')
    return submitHandler(selectedOpts)
  }

  const onInvalid: SubmitErrorHandler<FieldValues> = (errors) => {
    for (const eErrors of Object.values(errors)) {
      // @ts-ignore
      for (const error of eErrors) {
        if (error.message) {
          toast({
            status: 'error',
            title: t('cc.validation.required'),
            description: error.message,
          })
          return
        }
      }
    }
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

  return (
    <>
      {!loaded && (
        <Flex align='center' justify='center' width={'full'}>
          <Spinner size='sm' />
        </Flex>
      )}
      <Box>
        <ElectionQuestionsForm onInvalid={onInvalid} onSubmit={onSubmit} />
        <FormControl isInvalid={!!globalError}>
          <FormErrorMessage sx={styles.error}>{globalError}</FormErrorMessage>
        </FormControl>
      </Box>

      {loaded && !voted && (
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
