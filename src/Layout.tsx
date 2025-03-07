import { Button, Grid, Image, Link, Stack } from '@chakra-ui/react'
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom'
import { LanguagesMenu } from '~components/Layout/LanguagesList'
import { VocdoniAppURL } from '~constants'
import Footer from './theme/components/Footer'

const Layout = () => {
  const { pathname } = useLocation()

  return (
    <Grid p={3} minH='100vh'>
      <Stack direction='row' mb={3} w='full' justifyContent='space-between'>
        <Link as={RouterLink} to={`/${window.location.hash}`}>
          <Image src={`/assets/imaged/logo.png`} alt='logo' maxW={'150px'} />
        </Link>
        <Stack direction='row' alignItems='center' mb={3} alignSelf='start' ml='auto'>
          <Link href={VocdoniAppURL}>
            <Button variant='link'>Admin</Button>
          </Link>
          <LanguagesMenu />
        </Stack>
      </Stack>
      <Outlet />
      <Footer />
    </Grid>
  )
}

export default Layout
