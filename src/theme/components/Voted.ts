import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { votedAnatomy } from '@vocdoni/chakra-components'

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(votedAnatomy)

const baseStyle = definePartsStyle({
  container: {
    width: { base: 'full', md: '560px' },
    mx: 'auto',
    mt: 10,
    px: { base: 5, md: 6 },
    py: 6,
    borderRadius: '12px',
    border: '1px solid #f3a07a',
    backgroundColor: 'transparent',
    boxShadow: '0px 4px 12px rgba(255, 99, 32, 0.18)',
    color: '#FF6320',
  },
  icon: {
    color: '#FF6320',
    mr: 0,
  },
  title: {
    color: '#FF6320',
    fontWeight: 700,
    mb: 2,
  },
  description: {
    color: '#FF6320',
  },
  link: {
    color: '#FF6320',
    textDecoration: 'underline',
  },
})

export const Voted = defineMultiStyleConfig({
  baseStyle,
})
