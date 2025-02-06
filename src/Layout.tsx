import { Button, Grid, Image, Link, Stack } from '@chakra-ui/react'
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom'
import { ColorModeSwitcher } from '~components/ColorModeSwitcher'
import { LanguagesMenu } from '~components/Layout/LanguagesList'
import { VocdoniAppURL } from '~constants'
import Footer from './theme/components/Footer'

const Layout = () => {
  const { pathname } = useLocation()

  return (
    <Grid p={3}>
      <Stack direction='row' mb={3} w='full' justifyContent='space-between'>
        {pathname !== '/' && import.meta.env.CLIENT !== 'default' && (
          <Link as={RouterLink} to='/'>
            <Image src={`/assets/${import.meta.env.CLIENT.toLowerCase()}/logo.png`} alt='logo' maxW='250px' />
          </Link>
        )}
        <Stack direction='row' alignItems='center' mb={3} alignSelf='start' ml='auto'>
          <Link href={VocdoniAppURL}>
            <Button colorScheme='pink'>Admin</Button>
          </Link>
          <LanguagesMenu />
          <ColorModeSwitcher />
        </Stack>
      </Stack>
      <Outlet />
      <Footer />
    </Grid>
  )
}

export default Layout
