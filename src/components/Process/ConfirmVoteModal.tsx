import {
  Box,
  Button,
  Flex,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Text,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import { useConfirm } from '@vocdoni/chakra-components'
import { ElectionResultsTypeNames, PublishedElection } from '@vocdoni/sdk'
import { FieldValues } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { IoWarningOutline } from 'react-icons/io5'
import confirmImg from '/assets/modal-voting.png'

export const ConfirmVoteModal = ({ election, answers }: { election: PublishedElection; answers: FieldValues }) => {
  const { t } = useTranslation()
  const styles = useMultiStyleConfig('ConfirmModal')
  const { cancel, proceed } = useConfirm()

  const canAbstain =
    election.resultsType.name === ElectionResultsTypeNames.MULTIPLE_CHOICE && election.resultsType.properties.canAbstain

  return (
    <>
      <ModalCloseButton />
      <ModalHeader>
        <Box bgImage={confirmImg} minH='280px' />
      </ModalHeader>
      <ModalBody display='flex' flexDirection='column' gap={5} p={0} mb={2}>
        <Text>{t('process.spreadsheet.confirm.description')}</Text>

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
                        answer: q.choices[Number(answers[i])].title.default,
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
                          answers[0].length === 0
                            ? t('process.spreadsheet.confirm.blank_vote')
                            : answers[0]
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
        {canAbstain && answers[0].length < election.voteType.maxCount! && (
          <Flex direction={'row'} py={2} gap={2} alignItems={'center'} color={'primary.main'}>
            <IoWarningOutline />
            <Text display='flex' flexDirection='column' gap={1}>
              {t('process.spreadsheet.confirm.abstain_count', {
                count: election.voteType.maxCount! - answers[0].length,
              })}
            </Text>
          </Flex>
        )}
      </ModalBody>
      <Text mt={2}>{t('process.spreadsheet.confirm.disclaimer')}</Text>
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
