import { SubmitFormValidation } from '@vocdoni/chakra-components'
import { useToast } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

/**
 * File to store paritary erc project specific code
 */

export const useFormValidation = () => {
  const { t } = useTranslation()
  const toast = useToast()

  const formValidation: SubmitFormValidation = (values) => {
    const title = t('paritary_errors.title')
    const description = t('paritary_errors.description')
    toast({
      status: 'error',
      title: title,
      description: description,
    })
    if (!sameLengthValidator(values)) {
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
