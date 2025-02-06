import { Box, Flex, Image, Link, Text } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import VocdoniLogo from '~components/Layout/Logo'
import bergaImg from '/assets/berga/berga.jpg'

const Berga = () => (
  <Flex flexDirection='column' gap={10} maxW='900px' mx='auto' p={5} minH='100vh'>
    <Image src={bergaImg} width='300px' alt='ajuntament berga escut' mx='auto' />
    <Box>
      <Text as='h1' fontWeight='bold' fontSize='36px' textAlign='center'>
        Pressupostos Participatius 2025
      </Text>
      <Text as='h2' fontSize='16px' textAlign='center'>
        Ajuntament de Berga
      </Text>
    </Box>
    <Box>
      <Text as='h3' fontWeight='bold'>
        Pressupost Participatiu de Berga 2025
      </Text>
      <Text>
        El pressupost participatiu és una eina de participació ciutadana per a què els veïns i les veïnes puguin decidir
        a quins projectes o activitats es destina una part del pressupost públic municipal.
        <br />
        <br />
        L'Ajuntament de Berga promou per sisé any consecutiu el pressupost participatiu. Comptarà amb una partida de
        XX.000€, els quals es podran destinar tant a propostes d'inversió (màxim de XX.000 €) com de programació
        cultural (màxim de XX.000€). En la votació de l'any passat (2024) va resultar guanyadora la millora de l'entorn
        de la residència Sant Bernabé amb la creació d'un espai de jardí tancat, net i controlat amb col·locació d'una
        tanca emmarcada dins l'àmbit de "Inversió" i el projecte de Art Urbà: els murs pel canvi dins l'àmbit de
        "Cultura".
      </Text>
    </Box>
    <Box>
      <Text as='h3' fontWeight='bold'>
        Pressupost Participatiu Juvenil
      </Text>
      <Text>
        El consistori promou per tercer any el pressupost participatiu adreçat a joves de 12 a 15 anys que s'organitzarà
        a través dels centres educatius de la ciutat. Comptarà amb una partida de X.000€ que es podran destinar tant a
        propostes d'inversió com de programació cultural.
        <br />
        <br />
        En la tercera edició (2024) va resultar guanyadora la organització d'activitats en oci nocturn: DJs, festa major
        jove, etc. Dues o tres nits de DJ's, disco mòbil o altres activitats musicals, en places de Berga.
      </Text>
    </Box>
    <Box>
      <Text alignSelf='start' mb={10}>
        <strong>Seleccioneu</strong> una opció depenent de la teva edat
      </Text>
      <Flex gap={5} flexDirection={{ base: 'column', md: 'row' }}>
        <ProcessLink id='6be21a5a9dc0d60812a70bb63b3693846873c371c2463472a4d3020800000006'>
          <Text fontSize='18px'>Accedeix a la votació Juvenil</Text>
          <Text>12 - 15 anys</Text>
        </ProcessLink>
        <ProcessLink id='6be21a5a9dc0d60812a70bb63b3693846873c371c2463472a4d3020000000007'>
          <Text fontSize='18px'>Accedeix a la votació General</Text>
          <Text>+16 anys</Text>
        </ProcessLink>
      </Flex>
    </Box>
    <Text>
      Per poder accedir a la votació, us demanarem el vostre número de DNI (Document Nacional d'Identitat) i data de
      naixement. Posteriorment, podreu seleccionar les vostres opcions i enviar el vot de forma segura.
    </Text>
    <Flex as={Link} justifyContent='center' mt='auto' href='https://vocdoni.io' isExternal>
      <VocdoniLogo maxW='200px' />
    </Flex>
  </Flex>
)

const ProcessLink = ({ id, ...rest }: PropsWithChildren<{ id: string }>) => (
  <Link
    as={ReactRouterLink}
    flexGrow={1}
    display='flex'
    justifyContent='center'
    alignItems='center'
    flexWrap='wrap'
    flexDir='column'
    h={{ base: '100px', md: '200px' }}
    borderRadius='md'
    color='black'
    textDecoration='none'
    textAlign='center'
    fontWeight='bold'
    boxShadow='0px 0px 10px 2px lightgray'
    _hover={{
      bgColor: 'lightgray',
    }}
    _active={{
      transform: 'scale(0.9)',
    }}
    to={`/${id}`}
    {...rest}
  />
)

export default Berga
