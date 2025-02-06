import { Button, Grid, Image, Link, Stack } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { ColorModeSwitcher } from '~components/ColorModeSwitcher'
import { LanguagesMenu } from '~components/Layout/LanguagesList'
import { VocdoniAppURL } from '~constants'
import Footer from './theme/components/Footer'

const Layout = () => (
  <Grid p={3}>
    <Stack direction='row' mb={3} w='full' justifyContent='space-between'>
      {import.meta.env.CLIENT !== 'default' && (
        <Image src={`/assets/${import.meta.env.CLIENT.toLowerCase()}/logo.png`} alt='logo' maxW='250px' />
      )}
      <Stack direction='row' alignItems='center' mb={3} alignSelf='start'>
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

export const HomeLayout = () => (
  <Grid p={3}>
    <Stack direction='row' justifySelf='flex-end' alignItems='center' mb={3}>
      <Link href={VocdoniAppURL}>
        <Button colorScheme='pink'>Admin</Button>
      </Link>
      <LanguagesMenu />
      <ColorModeSwitcher />
    </Stack>
    <Outlet />
    <Footer />
  </Grid>
)

export default Layout
