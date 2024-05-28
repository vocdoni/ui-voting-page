import { Box, Button, Flex, ModalBody, ModalFooter, ModalHeader, Text, useMultiStyleConfig } from '@chakra-ui/react'
import { useConfirm } from '@vocdoni/chakra-components'
import { ElectionResultsTypeNames, PublishedElection } from '@vocdoni/sdk'
import { FieldValues } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { IoWarningOutline } from 'react-icons/io5'

export const ConfirmVoteModal = ({ election, answers }: { election: PublishedElection; answers: FieldValues }) => {
  const { t } = useTranslation()
  const styles = useMultiStyleConfig('ConfirmModal')
  const { cancel, proceed } = useConfirm()

  const canAbstain =
    election.resultsType.name === ElectionResultsTypeNames.MULTIPLE_CHOICE && election.resultsType.properties.canAbstain

  return (
    <>
      <ModalHeader>
        <Text mb='0px !important' textAlign='center'>
          {t('process.spreadsheet.confirm.header')}
        </Text>
      </ModalHeader>
      <ModalBody display='flex' flexDirection='column' gap={5} p={0} mb={2}>
        <Text>{t('process.spreadsheet.confirm.description')}</Text>
        <Flex
          className='custom-scrollbar'
          flexDirection='column'
          maxH='500px'
          overflowY='scroll'
          boxShadow='rgba(128, 128, 128, 0.42) 1px 1px 1px 1px'
          px={2}
          borderRadius='lg'
        >
          {election.questions.map((q, i) => (
            <Box key={i} mb={2} mt={i === 0 ? 4 : 0}>
              <Text display='flex' flexDirection='column' gap={1} mb={1}>
                <Trans
                  i18nKey='process.spreadsheet.confirm.question'
                  components={{
                    span: <Text as='span' fontWeight='bold' whiteSpace='nowrap' />,
                  }}
                  values={{
                    question: q.title.default,
                    answer: q.choices[Number(answers[i])].title.default,
                    number: i + 1,
                  }}
                />
              </Text>
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
      <ModalFooter sx={styles.footer}>
        <Button onClick={cancel!} bgColor='white' color='black' border='1px solid' _hover={{ bgColor: '#f1f1f1' }}>
          {t('cc.confirm.cancel')}
        </Button>
        <Button onClick={proceed!}>{t('cc.confirm.confirm')}</Button>
      </ModalFooter>
    </>
  )
}
