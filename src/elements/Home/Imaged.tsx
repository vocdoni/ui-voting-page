import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, extendTheme, Heading, Text, ThemeProvider, VStack } from '@chakra-ui/react'
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
      display: 'none',
      justifyContent: 'center',
      alignItems: 'end',
      mb: 2,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 'xl',
      marginBottom: 1,
      minW: '100%',
      display: 'block',
      textAlign: 'center',
      mt: 2,
      mb: 6,
    },
    description: {
      marginBottom: 4,
    },
    error: {
      width: 'full',
    },
    alert: {
      my: '40px',
      w: 'fit-content',
      borderRadius: 'lg',
      border: '1px solid #ccc',
    },
    alertLink: {
      textDecoration: 'underline',

      _hover: {
        textDecoration: 'none',
      },
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
      maxWidth: '240px',
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
    },
  }),
})
const Election = () => {
  const { connected, voted } = useElection()
  return (
    <VStack minH={'70vh'}>
      <SpreadsheetAccess />
      <ElectionQuestions w='full' />
      {connected && !voted && (
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
      {connected && voted && (
        <Text fontWeight={'bold'}>Els resultats es faran públics per part de l'Ajuntament després de la votació.</Text>
      )}
    </VStack>
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
          <Heading as={'h1'} size={'lg'} mt={{ lg: '-70px' }} mb={0} textAlign={'center'}>
            Pressupost Participatiu 2025
          </Heading>
          <Heading as={'h2'} size={'md'} mt={{ lg: '-10px' }} textAlign={'center'}>
            Ajuntament de Castelló d'Empúries
          </Heading>
          <Election />
        </ElectionProvider>
      </ThemeProvider>
    </VStack>
  )
}

export default Imaged
