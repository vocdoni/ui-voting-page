import { Box, Button, Flex, Icon } from '@chakra-ui/react'
import { useClient } from '@vocdoni/react-providers'
import { useTranslation } from 'react-i18next'
import { MdOutlineLogout } from 'react-icons/md'
import { Outlet } from 'react-router-dom'
import { useAccount, useDisconnect } from 'wagmi'
import { LanguagesMenu } from '~components/Layout/LanguagesList'
import { VocdoniAppURL } from '~constants'

const Layout = () => {
  const { disconnect } = useDisconnect()
  const { isConnected } = useAccount()
  const { t } = useTranslation()
  const { clear } = useClient()

  return (
    <Box className='site-wrapper' w='full' mx='auto' py={{ base: '12px', md: '24px' }} position='relative'>
      <Flex justifyContent='end' gap={5} px={{ base: '10px', sm: '20px', md: '80px' }} mb={3}>
        <a href={VocdoniAppURL}>
          <Button colorScheme='pink'>Admin</Button>
        </a>
        {isConnected && (
          <Button
            onClick={() => {
              disconnect()
              clear()
            }}
            fontWeight='bold'
            variant='transparent'
          >
            <Icon as={MdOutlineLogout} mr={1} />
            {t('menu.logout')}
          </Button>
        )}
        <LanguagesMenu />
      </Flex>
      <Outlet />
    </Box>
  )
}

export default Layout
