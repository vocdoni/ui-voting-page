import { Box, Button, Flex } from '@chakra-ui/react'
import { useClient } from '@vocdoni/react-providers'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { useAccount, useDisconnect } from 'wagmi'
import { LanguagesMenu } from '~components/Layout/LanguagesList'
import { VocdoniAppURL } from '~constants'

const Layout = () => {
 
  return (
    
    <Box className='site-wrapper' w='full' mx='auto' py={{ base: '12px', md: '24px' }} position='relative'>
     
      <Outlet />
    </Box>
  )
}

export default Layout
