import {
  AspectRatio,
  Box,
  Flex,
  Heading,
  Image,
  Link,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import { ElectionTitle, SpreadsheetAccess } from '@vocdoni/chakra-components'
import { ElectionProvider, useElection } from '@vocdoni/react-providers'
import { generatePath, Link as RouterLink } from 'react-router-dom'

import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import logo from '/assets/pxll/assemblea.jpg'

const Pxll = () => {
  const videoRef = useRef<HTMLDivElement>(null)
  const [videoTop, setVideoTop] = useState<boolean>(false)
  const { connected } = useElection()

  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current) return

      const rect = videoRef.current.getBoundingClientRect()
      if (rect.top <= 10) {
        setVideoTop(true)
      } else {
        setVideoTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Flex
      flexDirection='column'
      gap={10}
      maxW='900px'
      mx='auto'
      p={5}
      minH='100vh'
      w='full'
      pb={20}
      mt={{ lg2: '-128px' }}
    >
      <Image src={logo} alt='logo plataforma per la llengua' mx='auto' maxH='200px' />
      <Box>
        <Text as='h1' fontWeight='bold' fontSize='36px' textAlign='center'>
          Assemblea General Ordinària
        </Text>
        <Text as='h2' fontSize='16px' textAlign='center'>
          Associació Plataforma per la Llengua - Col·lectiu l'Esbarzer
        </Text>
      </Box>
      <Flex flexDirection={{ base: 'column', lg: 'row' }}>
        <Box order={{ base: 2, lg: 1 }} gap={3} display='flex' flexDir='column'>
          <Text as='h3' fontWeight='bold'>
            Ordre del dia de l'Assemblea General Ordinària:
          </Text>
          <OrderedList>
            <ListItem>Aprovació, si escau, de l'acta de l'anterior assemblea.</ListItem>
            <ListItem>Aprovació, si escau, de la memòria d'activitats 2024.</ListItem>
            <ListItem>Aprovació, si escau, de l'estat de comptes 2024.</ListItem>
            <ListItem>Aprovació, si escau, del pla d'activitats 2025.</ListItem>
            <ListItem>Aprovació, si escau, del pressupost de l'entitat 2025.</ListItem>
            <ListItem>Ratificació de les incorporacions per substitució a l'Executiva.</ListItem>
            <ListItem>Torn obert de preguntes.</ListItem>
          </OrderedList>
          <UnorderedList mt={5}>
            <ListItem>
              <Text>
                Enllaç a documentació externa:{' '}
                <Link
                  isExternal
                  href='https://www.plataforma-llengua.cat/documents-ago2025/
'
                >
                  Documentació 🔗
                </Link>
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                Enllaç a plataforma de precs i preguntes:{' '}
                <Link isExternal href='https://www.plataforma-llengua.cat/ago-2025-precs-i-preguntes/'>
                  Precs i Preguntes 🔗
                </Link>
              </Text>
            </ListItem>
          </UnorderedList>
        </Box>
        {connected && import.meta.env.STREAM_URL && (
          <Box order={{ base: 1, lg: 2 }} mb={{ base: 6, lg: 0 }} mx='auto'>
            <Box ref={videoRef} />
            <Box
              ml={videoTop ? 'auto' : 'none'}
              position={{ lg: videoTop ? 'fixed' : 'initial' }}
              top={20}
              right={10}
              zIndex={100}
              w={{ base: '400px', lg: '400px' }}
            >
              <AspectRatio ratio={16 / 9}>
                <ReactPlayer url={import.meta.env.STREAM_URL} width='100%' height='100%' playing controls />
              </AspectRatio>
            </Box>
          </Box>
        )}
      </Flex>
      {connected && (
        <Flex flexDir='column' gap={6} mb={10}>
          <Heading as='h3' fontSize='xl' fontWeight='bold' textAlign='center'>
            Votacions
          </Heading>
          {import.meta.env.PROCESS_IDS.map((id: string) => (
            <ElectionButtonCard id={id} key={id} />
          ))}
        </Flex>
      )}
      { false && (
        <SpreadsheetAccess hashPrivateKey />
      )}
      { true && (
        <h1>La votació començarà el dissabte 22 de març.</h1>
      )}
      {!connected && (
        <Text>
          Per poder accedir a la votació i veure el vídeo en temps real, heu de prémer sobre “Identificar-se”. Us
          demanarem el vostre DNI/NIE i el codi de pas que heu rebut per correu electrònic. Posteriorment, podreu emetre
          el vostre vot de forma segura.
        </Text>
      )}
    </Flex>
  )
}

const ElectionButtonCard = ({ id }: { id: string }) => (
  <ElectionProvider id={id}>
    <Link as={RouterLink} to={generatePath('/:id', { id }) + `/${window.location.hash}`} isExternal>
      <Box
        w='full'
        p={5}
        bg='white'
        color='black'
        boxShadow='rgba(0, 0, 0, 0.24) 0px 3px 8px'
        borderRadius='lg'
        _active={{ boxShadow: 'md' }}
        _hover={{ boxShadow: 'md' }}
      >
        <ElectionTitle fontSize='normal' m={0} />
      </Box>
    </Link>
  </ElectionProvider>
)

const Plataforma = () => (
  <ElectionProvider id={import.meta.env.PROCESS_IDS[0]}>
    <Pxll />
  </ElectionProvider>
)

export default Plataforma
