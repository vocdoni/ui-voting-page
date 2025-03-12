import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { confirmAnatomy } from '@vocdoni/chakra-components'

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(confirmAnatomy)

const baseStyle = definePartsStyle({
  confirm: {
    bgColor: '#3f49d3',
    color: 'white',
    borderRadius: 'lg',
    _hover: {
      bgColor: '#2a35c3',
    },
  },
  cancel: {
    display: 'none',
  },
  footer: {
    justifyContent: 'center',
  },
})

export const ConfirmModal = defineMultiStyleConfig({
  baseStyle,
})
