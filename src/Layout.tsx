import { Button, Grid, Image, Link, Stack } from '@chakra-ui/react'
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom'
import { VocdoniAppURL } from '~constants'
import Footer from './theme/components/Footer'

const Layout = () => {
  const { pathname } = useLocation()

  return (
    <Grid p={3} minH='100vh'>
      <Stack direction='row' mb={3} w='full' justifyContent='space-between'>
        {import.meta.env.CLIENT !== 'default' && (
          <Link as={RouterLink} to={`/${window.location.hash}`}>
            <Image src={`/assets/${import.meta.env.CLIENT.toLowerCase()}/logo.png`} alt='logo' maxW='250px' />
          </Link>
        )}
        <Stack direction='row' alignItems='center' mb={3} alignSelf='start' ml='auto'>
          <Button as={Link} variant='link' isExternal href={VocdoniAppURL}>
            Admin
          </Button>
        </Stack>
      </Stack>
      <Outlet />
      <Footer />
    </Grid>
  )
}

export default Layout
