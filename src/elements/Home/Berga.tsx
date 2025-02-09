import { Box, Flex, Image, Link, Text } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import VocdoniLogo from '~components/Layout/Logo'
import bergaImg from '/assets/berga/logo.png'

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
        L'Ajuntament de Berga promou per sisè any consecutiu el pressupost participatiu. Comptarà amb una partida de
        45.000 €, els quals es podran destinar tant a propostes d'inversió (màxim de 30.000 €) com a propostes culturals
        (màxim de 10.000 €). En la votació de l'any passat (2024) van resultar guanyadores en l'àmbit d'inversió: la
        millora de l'entorn de la residència Sant Bernabé i la proposta de millora i manteniment dels parcs infantils i
        en l'àmbit de Cultura: el projecte de Art Urbà: Els murs pel canvi i la Mostra de Teatre Amateur del Berguedà.
      </Text>
    </Box>
    <Box>
      <Text as='h3' fontWeight='bold'>
        Pressupost Participatiu Juvenil
      </Text>
      <Text>
        El consistori promou per quart any el pressupost participatiu adreçat a joves de 12 a 15 anys que s'organitzarà
        a través dels centres educatius de la ciutat. Comptarà amb una partida de 5.000 € que es podran destinar tant a
        propostes d'inversió com de programació cultural.
        <br />
        <br />
        En la tercera edició (2024) va resultar guanyadora la organització d'activitats d'oci nocturn.
      </Text>
    </Box>
    <Box>
      <Text textAlign='center' fontWeight='bold' mb={5} mt='30px' fontSize='20px'>
        LA VOTACIÓ COMENÇARÀ EL DIJOUS 13 DE FEBRER A LES 9:30
      </Text>
      <Box display='none'>
        <Text alignSelf='start' mb={10}>
          <strong>Seleccioneu</strong> una opció depenent de la teva edat
        </Text>
        <Flex gap={5} flexDirection={{ base: 'column', md: 'row' }}>
          <ProcessLink id='b31dff61814dd60812a70bb63b3693846873c371c2463472a4d3020800000000'>
            <Text fontSize='18px'>Accedeix a la votació Juvenil</Text>
            <Text>12 - 15 anys</Text>
          </ProcessLink>
          <ProcessLink id='b31dff61814dd60812a70bb63b3693846873c371c2463472a4d3020000000001'>
            <Text fontSize='18px'>Accedeix a la votació General</Text>
            <Text>+16 anys</Text>
          </ProcessLink>
        </Flex>
      </Box>
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
