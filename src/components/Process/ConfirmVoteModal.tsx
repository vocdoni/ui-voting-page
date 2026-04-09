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
        <Text textAlign='center'>{t('process.spreadsheet.confirm.description')}</Text>
        <Flex
          className='custom-scrollbar'
          flexDirection='column'
          maxH='500px'
          overflowY='scroll'
          border='1px solid'
          borderColor='gray.200'
          boxShadow='0px 6px 18px rgba(15, 23, 42, 0.08)'
          px={{ base: 3, md: 5 }}
          py={3}
          borderRadius='xl'
          bg='white'
        >
          {election.questions.map((q, i) => (
            <Box
              key={i}
              py={3}
              borderBottom={i === election.questions.length - 1 ? 'none' : '1px solid'}
              borderColor='gray.100'
            >
              <Text fontSize='sm' fontWeight='bold' color='gray.700' mb={1}>
                {q.title.default}
              </Text>
              <Text color='gray.900'>
                {q.choices[Number(answers[i])].title.default}
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
