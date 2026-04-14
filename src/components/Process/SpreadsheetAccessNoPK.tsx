import {
  Button,
  ChakraProps,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

const FORM_URL = 'https://www.omnium.cat/ca/vota-eleccions-oc'

type SpreadsheetAccessNoPKProps = ChakraProps

export const SpreadsheetAccessNoPK = ({ ...rest }: SpreadsheetAccessNoPKProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const styles = useMultiStyleConfig('SpreadsheetAccess', rest)
  const { t } = useTranslation()

  return (
    <>
      <Button onClick={onOpen} sx={styles.button}>
        {t('cc.spreadsheet.access_button')}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay sx={styles.overlay} />
        <ModalContent sx={styles.content}>
          <ModalHeader sx={styles.header}>{t('cc.spreadsheet.modal_title')}</ModalHeader>
          <ModalCloseButton sx={styles.top_close} />
          <ModalBody sx={styles.body}>
            <Text textAlign='center' fontSize='sm'>
              {t('cc.spreadsheet.no_private_key_help_prefix')}{' '}
              <Link
                href={FORM_URL}
                target='_blank'
                color='#FF6320'
                textDecoration='underline'
                _hover={{ textDecoration: 'none' }}
              >
                {t('cc.spreadsheet.no_private_key_help_link')}
              </Link>
            </Text>
          </ModalBody>
          <ModalFooter sx={styles.footer}>
            <Button onClick={onClose} sx={styles.close}>
              {t('cc.spreadsheet.close')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
