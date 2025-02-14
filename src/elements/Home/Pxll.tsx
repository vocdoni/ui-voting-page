import { Box, Flex, Image, Link, ListItem, OrderedList, Text } from '@chakra-ui/react'
import bergaImg from '/assets/berga/logo.png'

const Pxll = () => (
  <Flex flexDirection='column' gap={10} maxW='900px' mx='auto' p={5} minH='100vh'>
    <Image src={bergaImg} width='300px' alt='ajuntament berga escut' mx='auto' />
    <Box>
      <Text as='h1' fontWeight='bold' fontSize='36px' textAlign='center'>
        Assemblea General Ordinària
      </Text>
      <Text as='h2' fontSize='16px' textAlign='center'>
        Associació Plataforma per la Llengua - Col·lectiu l'Esbarzer
      </Text>
    </Box>
    <Box>
      <Text as='h3' fontWeight='bold'>
        Ordre del dia de l'Assemblea General Ordinària
      </Text>
      <OrderedList>
        <ListItem>Aprovació, si escau, de l'acta de l'anterior assemblea.</ListItem>
        <ListItem>Aprovació, si escau, del Reglament electoral.</ListItem>
        <ListItem>Aprovació, si escau, del Reglament de l'Assemblea General Ordinària 2025.</ListItem>
        <ListItem>Aprovació, si escau, del projecte d'activitats 2024.</ListItem>
        <ListItem>Aprovació, si escau, de l'estat de comptes 2024.</ListItem>
        <ListItem>Aprovació, si escau, del Pla d'activitats 2025.</ListItem>
        <ListItem>Aprovació, si escau, del Pressupost de l'entitat 2025.</ListItem>
        <ListItem>Ratificació de les incorporacions per substitució a l'Executiva 2024-2026.</ListItem>
        <ListItem>Torn obert de preguntes.</ListItem>
      </OrderedList>
      <Text>
        Enllaç a documentació externa:{' '}
        <Link isExternal href='https://www.plataforma-llengua.cat/ago-2025-documentacio/'>
          Documentació 🔗
        </Link>
      </Text>
      <Text>
        - Enllaç a plataforma de precs i preguntes:{' '}
        <Link isExternal href='https://www.plataforma-llengua.cat/ago-2024-precs-i-preguntes/'>
          Precs i Preguntes 🔗
        </Link>
      </Text>
    </Box>
    <Text>
      Per poder accedir a la votació i veure el vídeo en temps real, heu de prémer sobre “Identificar-se”. Us demanarem
      el vostre DNI/NIE i el codi de pas que heu rebut per correu electrònic. Posteriorment, podreu emetre el vostre vot
      de forma segura.
    </Text>
  </Flex>
)

export default Pxll
