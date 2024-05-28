import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { questionsAnatomy } from '@vocdoni/chakra-components'
import checkIcon from '/assets/check-icon.png'

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(questionsAnatomy)

const baseStyle = definePartsStyle({
  alert: {
    px: { base: 3, sm: 5 },
    py: 7,
    borderRadius: '8px',
    color: '#FF6320',
    bgColor: 'transparent',
    display: 'grid',
    columnGap: 4,
    justifyContent: 'center',
    alignItems: 'center',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: 'auto auto',
    boxShadow: 'var(--box-shadow-darker)',
    border: '1px solid #FF6320',

    '& span': {
      color: '#FF6320',
      ml: { base: 2, lg: 10, xl: 2 },
      gridRow: '1/3',
      gridColumn: '1/2',
    },
  },

  alertTitle: {
    fontSize: 'lg',
    whiteSpace: 'wrap',
  },

  alertDescription: {
    display: 'none',
  },

  alertLink: {
    display: 'none',
  },

  wrapper: {
    '& > form': {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,

      '& > div': {
        // hide the question type badge (single choice, multiple choice, etc)
        '&:first-of-type': {
          display: 'none',
        },
        position: 'relative',
      },
    },
  },

  question: {
    width: { base: 'full', xl: '80%' },
    m: 0,
    mx: 'auto',
    p: { base: 3, md: 10 },
    borderRadius: 'xl',
    boxShadow: 'var(--box-shadow)',

    '& > div': {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
  },

  title: {
    display: 'block',
    textAlign: 'start',
    fontSize: 'xl2',
    lineHeight: 1.3,
    mb: 5,
    ml: '10px',
  },

  description: {
    display: 'none',
  },

  stack: {
    '& label': {
      borderRadius: 'lg',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      w: { lg2: '99%' },

      _hover: {
        bgColor: '#eee',
      },

      '& span:nth-of-type(2)': {
        p: 2,
        pl: 9,
        m: 0,
        w: '100%',
        borderRadius: 'lg',
      },

      '& input:checked ~ span:nth-of-type(2)': {
        w: '100%',
      },
    },
  },

  radio: {
    borderRadius: 'full !important',
    border: '1px solid #FF6320',
    display: 'block',
    position: 'absolute',
    width: '20px',
    height: '20px',
    background: 'transparent',
    ml: '10px',

    '&[data-checked=""]': {
      '&:before': {
        display: 'none',
        bgColor: 'transparent',
      },

      background: '#28A745',
      borderColor: 'white',
      borderWidth: '1px',
      bgSize: '15px',
      bgRepeat: 'no-repeat',
      bgPosition: 'center',
      bgImage: checkIcon,
      _hover: {
        border: 'none',
        background: 'process.questions.question_selected.bg',
        borderColor: 'process.questions.question_selected.bg',
        bgSize: '15px',
        bgRepeat: 'no-repeat',
        bgPosition: 'center',
        bgImage: checkIcon,
      },
    },

    '&[data-disabled=""]': {
      border: '1px solid lightgray',
    },
  },

  checkbox: {
    // Checkbox label style
    '& span:nth-of-type(2)': {
      display: 'flex',
      flexDir: 'row',
      justifyContent: 'space-between',
      justifyItems: 'center',
      alignItems: 'center',
    },
  },

  error: {
    display: 'flex',
    justifyContent: 'center',
  },
})

export const ElectionQuestions = defineMultiStyleConfig({
  baseStyle,
})
