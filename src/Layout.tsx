import { Grid, Image, Link, Stack } from '@chakra-ui/react'
import { Outlet, Link as RouterLink } from 'react-router-dom'
import { LanguagesMenu } from '~components/Layout/LanguagesList'
import Footer from './theme/components/Footer'

const Layout = () => (
  <Grid p={3} minH='100vh'>
    <Stack direction='row' mb={3} w='full' justifyContent='space-between' alignItems={'center'}>
      <Link as={RouterLink} to={`/${window.location.hash}`}>
        <Image src={`/assets/imaged/logo.png`} alt='logo' maxW={'150px'} />
      </Link>
      <Stack direction='row' alignItems='center' mb={3} alignSelf='center' ml='auto'>
        <LanguagesMenu />
      </Stack>
    </Stack>
    <Outlet />
    <Footer />
  </Grid>
)
export default Layout
