import { Button, Grid, Image, Link, Stack } from '@chakra-ui/react'
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom'
import { LanguagesMenu } from '~components/Layout/LanguagesList'
import { VocdoniAppURL } from '~constants'
import Footer from './theme/components/Footer'

const Layout = () => {
  const { pathname } = useLocation()

  return (
    <Grid p={3} minH='100vh'>
      <Stack direction='row' mb={9} w='full' justifyContent='space-between'>
        {import.meta.env.CLIENT !== 'default' && (
          <Link as={RouterLink} to={`/${window.location.hash}`}>
            <Image src={`/assets/${import.meta.env.CLIENT.toLowerCase()}/logo.jpg`} alt='logo' maxW='250px' />
          </Link>
        )}
        <Stack direction='row' alignItems='center' mb={3} alignSelf='start' ml='auto'>
          <LanguagesMenu />
        </Stack>
      </Stack>
      <Outlet />
      <Footer />
    </Grid>
  )
}

export default Layout
