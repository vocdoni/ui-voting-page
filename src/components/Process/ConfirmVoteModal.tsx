import { Box, Button, Flex, ModalBody, ModalFooter, ModalHeader, Text, useMultiStyleConfig } from '@chakra-ui/react'
import { useConfirm, QuestionsConfirmationProps } from '@vocdoni/chakra-components'
import { ElectionResultsTypeNames } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { IoWarningOutline } from 'react-icons/io5'
import confirmImg from '/assets/spreadsheet-confirm-modal.jpg'

export const ConfirmVoteModal = ({ elections, answers }: QuestionsConfirmationProps) => {
  const { t } = useTranslation()
  const styles = useMultiStyleConfig('ConfirmModal')
  const { cancel, proceed } = useConfirm()

  return (
    <>
      <ModalHeader>
        <Box bgImage={`url(${confirmImg})`} />
      </ModalHeader>
      <ModalBody display='flex' flexDirection='column' gap={5} p={0} mb={2}>
        <Text>{t('process.spreadsheet.confirm.description')}</Text>
        {Object.values(elections).map(({ election, isAbleToVote }) => {
          const canAbstain =
            election.resultsType.name === ElectionResultsTypeNames.MULTIPLE_CHOICE &&
            election.resultsType.properties.canAbstain
          const eAnswers = answers[election.id]
          if (!isAbleToVote) {
            return (
              <Flex
                flexDirection='column'
                maxH='200px'
                overflowY='scroll'
                boxShadow='rgba(128, 128, 128, 0.42) 1px 1px 1px 1px'
                px={2}
                borderRadius='lg2'
              >
                <Box py={2}>
                  <Text fontWeight='bold' whiteSpace='nowrap' mb={1}>
                    {election.title.default}
                  </Text>
                  <Text fontWeight='bold' whiteSpace='nowrap' mb={1}>
                    {t('vote.not_able_to_vote')}
                  </Text>
                </Box>
              </Flex>
            )
          }
          return (
            <>
              <Flex
                flexDirection='column'
                maxH='200px'
                overflowY='scroll'
                boxShadow='rgba(128, 128, 128, 0.42) 1px 1px 1px 1px'
                px={2}
                borderRadius='lg2'
              >
                {election.questions.map((q, i) => (
                  <Box key={i}>
                    <Box py={2}>
                      <Text display='flex' flexDirection='column' gap={1} mb={1}>
                        <Trans
                          i18nKey='process.spreadsheet.confirm.question'
                          components={{
                            span: <Text as='span' fontWeight='bold' whiteSpace='nowrap' />,
                          }}
                          values={{
                            answer: q.title.default,
                            number: i + 1,
                          }}
                        />
                      </Text>
                      {election.resultsType.name === ElectionResultsTypeNames.SINGLE_CHOICE_MULTIQUESTION ? (
                        <Text display='flex' flexDirection='column' gap={1}>
                          <Trans
                            i18nKey='process.spreadsheet.confirm.option'
                            components={{
                              span: <Text as='span' fontWeight='bold' whiteSpace='nowrap' />,
                            }}
                            values={{
                              answer: q.choices[Number(eAnswers[i])].title.default,
                              number: i + 1,
                            }}
                          />
                        </Text>
                      ) : (
                        <Text display='flex' flexDirection='column' gap={1}>
                          <Trans
                            i18nKey='process.spreadsheet.confirm.options'
                            components={{
                              span: <Text as='span' fontWeight='bold' whiteSpace='nowrap' />,
                            }}
                            values={{
                              answers:
                                eAnswers[0].length === 0
                                  ? t('process.spreadsheet.confirm.blank_vote')
                                  : eAnswers[0]
                                      .map((a: string) => q.choices[Number(a)].title.default)
                                      .map((a: string) => `- ${a}`)
                                      .join('<br />'),
                            }}
                          />
                        </Text>
                      )}
                    </Box>
                    {i + 1 !== election.questions.length && <Box h='1px' bgColor='lightgray' />}
                  </Box>
                ))}
              </Flex>
              {canAbstain && eAnswers[0].length < election.voteType.maxCount! && (
                <Flex direction={'row'} py={2} gap={2} alignItems={'center'} color={'primary.main'}>
                  <IoWarningOutline />
                  <Text display='flex' flexDirection='column' gap={1}>
                    {t('process.spreadsheet.confirm.abstain_count', {
                      count: election.voteType.maxCount! - eAnswers[0].length,
                    })}
                  </Text>
                </Flex>
              )}
            </>
          )
        })}
      </ModalBody>
      <ModalFooter sx={styles.footer}>
        <Button onClick={cancel!} variant='ghost' sx={styles.cancel}>
          {t('cc.confirm.cancel')}
        </Button>
        <Button onClick={proceed!} sx={styles.confirm}>
          {t('cc.confirm.confirm')}
        </Button>
      </ModalFooter>
    </>
  )
}
