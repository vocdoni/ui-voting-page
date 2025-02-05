import { Box, Button, Grid, Stack } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { ColorModeSwitcher } from '~components/ColorModeSwitcher'
import { LanguagesMenu } from '~components/Layout/LanguagesList'
import { VocdoniAppURL } from '~constants'
import Footer from './theme/components/Footer'

const Layout = () => (
  <Box>
    <Grid p={3}>
      <Stack direction='row' justifySelf='flex-end' alignItems='center' mb={3}>
        <a href={VocdoniAppURL}>
          <Button colorScheme='pink'>Admin</Button>
        </a>
        <LanguagesMenu />
        <ColorModeSwitcher />
      </Stack>
      <Outlet />
      <Footer />
    </Grid>
  </Box>
)

export default Layout
