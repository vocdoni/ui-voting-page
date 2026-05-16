import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { questionAnatomy } from '@vocdoni/chakra-components'

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(questionAnatomy)

const baseStyle = definePartsStyle({
  container: {
    width: { base: 'full', xl: '80%' },
    mx: 'auto',
    px: { base: 6, md: 10 },
    py: { base: 6, md: 8 },
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.14)',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.16)',
  },
  header: {
    mb: 5,
  },
  title: {
    fontWeight: 700,
    fontSize: { base: 'xl', md: '2xl' },
    lineHeight: 1.25,
  },
})

export const ElectionQuestion = defineMultiStyleConfig({
  baseStyle,
})
