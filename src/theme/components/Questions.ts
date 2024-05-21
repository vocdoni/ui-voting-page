import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { questionsAnatomy } from '@vocdoni/chakra-components'
import checkIcon from '/assets/check-icon.png'

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(questionsAnatomy)

const baseStyle = definePartsStyle({
  alert: {
    px: { base: 3, sm: 5 },
    py: 7,
    mb: '30px',
    borderRadius: '8px',
    color: 'process.questions.alert.color',
    bgColor: 'process.questions.alert.bg',
    display: 'grid',
    columnGap: 4,
    justifyContent: 'center',
    alignItems: 'center',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: 'auto auto',
    boxShadow: 'var(--box-shadow-darker)',
    border: 'none',

    '& span': {
      color: 'white',
      ml: { base: 2, lg: 10, xl: 2 },
      gridRow: '1/3',
      gridColumn: '1/2',
    },
  },

  alertTitle: {
    fontSize: 'lg',
    mb: 3,
  },

  alertDescription: {
    display: 'flex',
    gap: 2,
    flexDirection: { base: 'column', lg2: 'row' },
    justifyContent: 'center',
    alignItems: { md: 'center' },
    whiteSpace: { base: 'pre-wrap', lg2: 'nowrap' },
  },

  alertLink: {
    display: 'block',
    w: '100%',
    px: 2,
    py: 1,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    color: 'process.questions.alert.link_color',
    backgroundColor: 'process.questions.alert.link_bg',
    borderRadius: 'md',
    fontSize: 'sm',

    _hover: {
      textDecoration: 'none',
    },
  },

  wrapper: {
    '& > form': {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,

      counterReset: 'indice',

      '& > div': {
        position: 'relative',
        counterIncrement: 'indice',

        '&::before': {
          content: `counter(indice) "."`,
          position: 'absolute',
          top: { base: '9.2px', md: '37.7px' },
          left: { base: 3, md: 10 },
          fontSize: '24px',
          fontWeight: 'extrabold',
          color: 'process.questions.title',
        },
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

    '& > div:first-of-type': {
      display: 'none',
    },

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
    color: 'process.questions.title',
    mb: 5,

    ml: 6,
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
    border: '1px solid red',
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

      background: 'red',
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
