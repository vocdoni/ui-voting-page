import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { QuestionsFormProvider, SpreadsheetAccess } from '@vocdoni/chakra-components'
import { useElection } from '@vocdoni/react-providers'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { VocdoniAppURL } from '~constants'
import { VoteButton } from './Aside'
import { ConfirmVoteModal } from './ConfirmVoteModal'
import Header from './Header'
import { Questions } from './Questions'
import { SuccessVoteModal } from './SuccessVoteModal'
import omniumLogoHeader from '/assets/omnium-logo.png'

export const ProcessView = () => {
  const { t } = useTranslation()
  const { isAbleToVote, connected } = useElection()
  const electionRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <Flex justifyContent='end' alignItems='center' gap={1} mb={{ base: 5, lg2: 8 }}>
        <Image
          src={omniumLogoHeader}
          maxW={{ base: '150px', md: '250px', lg: '300px' }}
          mr='auto'
          h='auto'
          alt='omnium logo'
        />

        <a href={VocdoniAppURL}>
          <Button bgColor='white' color='black' boxShadow='2px 2px 2px 2px lightgray' _hover={{ bgColor: '#f1f1f1' }}>
            Admin
          </Button>
        </a>

        {connected && (
          <Box>
            <SpreadsheetAccess />
          </Box>
        )}
      </Flex>
      <Header />

      <Box ref={electionRef} mb='50px' pt='25px'>
        <QuestionsFormProvider
          confirmContents={(election, answers) => <ConfirmVoteModal election={election} answers={answers} />}
        >
          <Questions />
        </QuestionsFormProvider>
      </Box>
      {isAbleToVote && (
        <Text mb={10} textAlign='center'>
          {t('process.helper')}
        </Text>
      )}
      <Box position='sticky' bottom={0} left={0} pb={1} pt={1}>
        <VoteButton />
      </Box>

      <SuccessVoteModal />
    </>
  )
}
