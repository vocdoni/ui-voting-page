import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'

const Layout = () => (
  <Box position='relative' pt={{ base: '32px', md: '64px' }}>
    <Outlet />
  </Box>
)

export default Layout
