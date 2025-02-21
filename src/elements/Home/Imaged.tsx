import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, extendTheme, Text, ThemeProvider, VStack } from '@chakra-ui/react'
import { ElectionQuestions, questionsAnatomy, questionTipAnatomy, SpreadsheetAccess } from '@vocdoni/chakra-components'
import { questionChoiceAnatomy } from '@vocdoni/chakra-components/src/theme/question-choice'
import { ElectionProvider } from '@vocdoni/react-providers'

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
    },
    checkbox: {
      display: 'flex',
      // flexWrap: 'wrap',
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
    wrapper: {
      // display: 'flex',
      // width: 'full',
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
    },
    control: {
      order: 3,
      alignSelf: 'end',
      border: '2px solid gray !important',
      // borderColor: 'gray !important',
      marginTop: 'auto',
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

const Imaged = () => {
  return (
    <VStack spacing={8} w='full' maxW='1024px' mx='auto'>
      <Text>This would be the landing page for multiple processes:</Text>
      <ThemeProvider
        theme={extendTheme({
          components: {
            Checkbox: CheckboxTheme,
            ElectionQuestions: QuestionsTheme,
            QuestionChoice: QuestionChoiceTheme,
            QuestionsTip,
          },
        })}
      >
        <ElectionProvider id={import.meta.env.PROCESS_IDS[0]} fetchCensus autoUpdate>
          <ElectionQuestions w='full' />
          <SpreadsheetAccess />
        </ElectionProvider>
      </ThemeProvider>
    </VStack>
  )
}

export default Imaged
