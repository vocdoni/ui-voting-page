import { Box, Flex, Icon, Link, Text, useColorModeValue } from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'
import { FaDiscord, FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import VocdoniLogo from '~components/Layout/Logo'

const Footer = () => {
  const { t } = useTranslation()
  const invert = useColorModeValue('invert(0%)', 'invert(100%)')

  return (
    <>
      <Flex
        width='full'
        m='0 auto'
        maxW='1920px'
        px={{
          base: '10px',
          sm: '20px',
          md: '80px',
        }}
        pt='24px'
        flexDirection={{ base: 'column', xl: 'row' }}
        alignItems='start'
        pb={{ base: '50px', xl: '24px' }}
        mt='auto'
      >
        <Box flex='1 1 33%'>
          <VocdoniLogo maxW='120px' />
          <Text fontSize='16px' lineHeight='28px'>
            {t('footer.footer_subtitle')}
          </Text>
        </Box>
        <Flex
          flex='1 1 67%'
          flexDirection={{ base: 'column', sm2: 'row' }}
          justifyContent={{ sm2: 'space-between', lg: 'space-between' }}
          gap={{ base: '30px', sm2: 0 }}
          mt={1}
          ml={{ xl: 10 }}
        >
          <Flex
            flexDirection={{ base: 'column', xl: 'row' }}
            justifyContent='space-between'
            gap={{ base: '40px', xl: '90px' }}
            w='full'
          >
            <Text fontWeight='bold' fontSize='18px' lineHeight='21px' mb='16px' display='none'>
              {t('footer.company')}
            </Text>
            <Link fontWeight='bold' variant='footer' href='https://www.vocdoni.io' target='_blank'>
              Vocdoni
            </Link>
            <Link
              fontWeight='bold'
              variant='footer'
              href='https://www.vocdoni.io/about'
              whiteSpace='nowrap'
              target='_blank'
            >
              {t('footer.about_us')}
            </Link>
            <Link fontWeight='bold' variant='footer' href='https://www.vocdoni.io/contact' target='_blank'>
              {t('footer.contact')}
            </Link>
            <Link fontWeight='bold' variant='footer' href='https://www.vocdoni.io/api' target='_blank'>
              SDK
            </Link>
            <Link
              fontWeight='bold'
              variant='footer'
              href='https://developer.vocdoni.io'
              whiteSpace='nowrap'
              target='_blank'
            >
              {t('footer.developer_portal')}
            </Link>
            <Link fontWeight='bold' variant='footer' href='https://blog.vocdoni.io' target='_blank'>
              Blog
            </Link>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        width='full'
        m='0 auto'
        maxW='1920px'
        px={{
          base: '10px',
          sm: '20px',
          md: '80px',
        }}
        flexDirection={{ base: 'column', md: 'row' }}
        gap={{ base: '20px', md: '10px' }}
        justifyContent='space-between'
        alignItems='center'
        py='12px'
        borderTop='1px solid rgb(229, 229, 229)'
      >
        <Text as='span' textAlign='center'>
          <Trans
            i18nKey='footer.terms_and_privacy'
            components={{
              link1: <Link href='https://app.vocdoni.io/terms' color='gray' isExternal />,
              link2: <Link href='https://app.vocdoni.io/privacy' color='gray' isExternal />,
            }}
          />
        </Text>
        <Flex gap='10px'>
          <Link variant='icon' href='https://twitter.com/vocdoni' target='_blank'>
            <Icon aria-label={t('link.twitter').toString()} as={FaXTwitter} />
          </Link>

          <Link variant='icon' href='https://chat.vocdoni.io/' target='_blank'>
            <Icon aria-label={t('link.discord').toString()} as={FaDiscord} />
          </Link>

          <Link variant='icon' href='https://github.com/vocdoni' target='_blank'>
            <Icon aria-label={t('link.github').toString()} as={FaGithub} />
          </Link>
        </Flex>
      </Flex>
    </>
  )
}

export default Footer
