import { Flex, Img } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'
import vocicon from '/assets/vocdoni_icon.png'

export const LogoImage = () => <Img src={vocicon} alt='vocdoni icon' maxWidth={10} />
export const LogoMbl = () => <Img src={vocicon} alt='vocdoni icon' maxWidth={10} />

const Logo = ({ ...props }) => (
  <NavLink to='/'>
    <Flex alignItems='center' gap={2} display={{ base: 'none', lg: 'flex' }}>
      <LogoImage />
    </Flex>
    <Flex alignItems='center' gap={2} display={{ base: 'flex', lg: 'none' }}>
      <LogoMbl />
    </Flex>
  </NavLink>
)

export default Logo
