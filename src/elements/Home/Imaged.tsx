import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, extendTheme, Heading, ThemeProvider, VStack } from '@chakra-ui/react'
import {
  confirmAnatomy,
  ElectionQuestions,
  questionChoiceAnatomy,
  questionsAnatomy,
  questionTipAnatomy,
  SpreadsheetAccess,
  spreadsheetAccessAnatomy,
  VoteButton,
} from '@vocdoni/chakra-components'
import { ElectionProvider, useElection } from '@vocdoni/react-providers'

const { defineMultiStyleConfig: defineQuestionsThemeConfig, definePartsStyle: defineQuestionsPartStyle } =
  createMultiStyleConfigHelpers(questionsAnatomy)

const QuestionsTheme = defineQuestionsThemeConfig({
  baseStyle: defineQuestionsPartStyle({
    question: {
      marginBottom: 8,
      display: 'flex',
      flexDirection: 'row',
    },
    stack: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '1.5rem',
    },
    checkbox: {
      display: 'flex',
    },
    typeBadgeWrapper: {
      w: 'full',
      display: 'flex',
      justifyContent: 'end',
      alignItems: 'end',
    },
    title: {
      fontWeight: 'bold',
      fontSize: 'xl',
      marginBottom: 1,
    },
    description: {
      marginBottom: 4,
    },
    error: {
      width: 'full',
    },
  }),
})

const { defineMultiStyleConfig: defineCheckboxThemeConfig, definePartsStyle: defineCheckboxPartStyle } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys)

const CheckboxTheme = defineCheckboxThemeConfig({
  defaultProps: {
    colorScheme: 'orange',
  },
  baseStyle: defineCheckboxPartStyle({
    container: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '250px',
      background: '#fafafa',
      padding: 3,
      borderRadius: 'lg',
      boxShadow: 'rgba(56, 60, 67, 0.05) 0px 0px 0px 1px, rgba(56, 60, 67, 0.33) 0px 1px 3px 0px',
      _checked: {
        outline: '1px solid #127721b0',
      },
    },
    control: {
      order: 3,
      alignSelf: 'end',
      marginTop: 'auto',
      _checked: {
        bgColor: 'green',
        borderColor: 'green',
        borderRadius: 'full',

        _hover: {
          bgColor: 'green',
          borderColor: 'green',
        },
      },
    },
    label: {
      mx: 'auto',
      mb: '10px',
    },
  }),
})

const { defineMultiStyleConfig: defineChoiceThemeConfig, definePartsStyle: defineChoicePartStyle } =
  createMultiStyleConfigHelpers(questionChoiceAnatomy)

const QuestionChoiceTheme = defineChoiceThemeConfig({
  baseStyle: defineChoicePartStyle({
    wrapper: {
      display: 'flex',
    },
    label: {
      fontWeight: 600,
    },
    description: {
      fontSize: 'sm',
    },
  }),
})

const { defineMultiStyleConfig: defineQuestionTipStyleConfig, definePartsStyle: defineQuestionTipPartStyle } =
  createMultiStyleConfigHelpers(questionTipAnatomy)

const QuestionsTip = defineQuestionTipStyleConfig({
  baseStyle: defineQuestionTipPartStyle({
    wrapper: {
      display: 'none',
    },
  }),
})

const {
  defineMultiStyleConfig: defineSpreadsheetAccessMultiStyleConfig,
  definePartsStyle: defineSpreadsheetAccessPartsStyle,
} = createMultiStyleConfigHelpers(spreadsheetAccessAnatomy)

const SpreasdsheetTheme = defineSpreadsheetAccessMultiStyleConfig({
  baseStyle: defineSpreadsheetAccessPartsStyle({
    button: {
      bgColor: '#3f49d3',
      color: 'white',
      px: '100px',

      _hover: {
        bgColor: '#2a35c3',
      },
    },
    disconnect: {
      bgColor: '#e53e3e',
      color: 'white',

      _hover: {
        bgColor: '#c53030',
      },
    },
    content: {
      px: 10,
      py: 5,
      gap: 6,
    },
    control: {
      '&:first-of-type': {
        mb: 6,
      },
      '&:nth-of-type(2)': {
        mb: 4,
      },
    },
    footer: {
      justifyContent: 'center',
      'button:first-of-type': {
        display: 'none',
      },
      'button:nth-of-type(2)': {
        bgColor: '#3f49d3',
        color: 'white',
        px: '100px',

        _hover: {
          bgColor: '#2a35c3',
        },
      },
    },
  }),
})
const { defineMultiStyleConfig: defineConfirmModalMultiStyleConfig, definePartsStyle: defineConfirmModalPartsStyle } =
  createMultiStyleConfigHelpers(confirmAnatomy)

const ConfirmModalTheme = defineConfirmModalMultiStyleConfig({
  baseStyle: defineConfirmModalPartsStyle({
    cancel: {
      display: 'none',
    },
    confirm: {
      bgColor: '#3f49d3',
      color: 'white',
      px: '100px',

      _hover: {
        bgColor: '#2a35c3',
      },
    },
    footer: {
      justifyContent: 'center',
      border: '1px solid red',
    },
  }),
})
const Election = () => {
  const { connected } = useElection()
  return (
    <>
      <SpreadsheetAccess />
      <ElectionQuestions w='full' />
      {connected && (
        <VoteButton
          sx={{
            mb: '150px',
            bgColor: '#3f49d3',
            color: 'white',
            w: '70%',

            _hover: {
              bgColor: '#2a35c3',
            },
          }}
        />
      )}
    </>
  )
}

const Imaged = () => {
  return (
    <VStack spacing={8} w='full' maxW='1360px' mx='auto'>
      <ThemeProvider
        theme={extendTheme({
          components: {
            Checkbox: CheckboxTheme,
            ElectionQuestions: QuestionsTheme,
            QuestionChoice: QuestionChoiceTheme,
            QuestionsTip,
            SpreadsheetAccess: SpreasdsheetTheme,
            ConfirmModal: ConfirmModalTheme,
          },
        })}
      >
        <ElectionProvider id={import.meta.env.PROCESS_IDS[0]} fetchCensus autoUpdate>
          <Heading as={'h1'} size={'lg'} mt='-60px'>
            Pressupostos Participatius 2025
          </Heading>
          <Heading as={'h2'} size={'md'}>
            Ajuntament de Castelló d'Empúries
          </Heading>
          <Election />
        </ElectionProvider>
      </ThemeProvider>
    </VStack>
  )
}

export default Imaged
