import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { spreadsheetAccessAnatomy } from '@vocdoni/chakra-components'

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(spreadsheetAccessAnatomy)

const baseStyle = definePartsStyle({
  button: {
    w: '100%',
    borderRadius: 30,
    color: 'process.spreadsheet.color',
  },

  disconnect: {
    w: 'min-content',
    textDecoration: 'underline',

    _hover: {
      textDecoration: 'none',
    },
    _active: {
      bgColor: 'transparent',
    },
  },
  label: {
    textTransform: 'none',
  },

  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  close: {
    display: 'none',
  },
  submit: {
    width: '60%',
    mx: 'auto',
    borderRadius: '30px',
    color: 'process.spreadsheet.color',
  },
})

export const SpreadsheetAccess = defineMultiStyleConfig({
  baseStyle,
})
