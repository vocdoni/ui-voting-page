import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { spreadsheetAccessAnatomy } from '@vocdoni/chakra-components'

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(spreadsheetAccessAnatomy)

const baseStyle = definePartsStyle({
  button: {
    w: '100%',
    borderRadius: 30,
    fontSize: { base: 'lg', xl: 'md' },

    color: 'white',

    _hover: {
      bgColor: '#E5531C',

      _disabled: {
        bgColor: '0.8',
      },
    },

    _active: {
      bgColor: '#FF8A50',
    },

    _disabled: {
      border: '1px solid red',
    },
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

    px: 16,
    bgColor: '#FF6320',
    color: 'white',

    _hover: {
      bgColor: '#E5531C',

      _disabled: {
        opacity: '0.8',
      },
    },

    _active: {
      bgColor: '#FF8A50',
    },

    _disabled: {
      border: '1px solid red',
    },
  },
})

export const SpreadsheetAccess = defineMultiStyleConfig({
  baseStyle,
})
