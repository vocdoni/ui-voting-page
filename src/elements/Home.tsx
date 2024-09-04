import { Box, Flex, Grid, Image, Text } from '@chakra-ui/react'
import demoImg from '/assets/demo.png'
import vocdoniIcon from '/assets/vocdoni.png'
import { Trans, useTranslation } from 'react-i18next'
import ProcessCardDetailed from '~components/Process/CardDetailed'
import { ElectionProvider, useElection } from '@vocdoni/react-providers'
import { PublishedElection } from '@vocdoni/sdk'
import { DemoMeta, ProcessIds } from '~constants'

interface IDemoData {
  orgName: string
  mainTitle: string
  date: string
}

const Home = () => {
  const { t } = useTranslation()
  const demoMeta = DemoMeta as IDemoData
  const startDate = new Date(demoMeta.date)

  return (
    <Flex flexDirection='column' gap={10} maxW='900px' mx='auto' p={5} minH='100vh'>
      <Image src={demoImg} width='300px' alt='ajuntament berga escut' mx='auto' />
      <Box>
        <Text as='h1' fontWeight='bold' fontSize='36px' textAlign='center'>
          {demoMeta.mainTitle}
        </Text>
        <Text as='h2' fontSize='16px' textAlign='center'>
          {demoMeta.orgName}
        </Text>
      </Box>
      <Text>
        <Text as='h3' fontWeight='bold'>
          {t('landing.desc_title')}
        </Text>
        <Text>
          <Trans
            i18nKey='landing.desc_body'
            components={{
              br: <br />,
            }}
            values={{
              orgName: demoMeta.orgName,
              date: startDate.toLocaleDateString(),
              time: startDate.toLocaleTimeString(),
            }}
          />
        </Text>
      </Text>
      <Box>
        <Text alignSelf='start' mb={10}>
          <Trans
            i18nKey='landing.select_an_option'
            components={{
              strong: <strong />,
            }}
          />
        </Text>
        {ProcessIds && (
          <Grid templateColumns='repeat(auto-fill, minmax(350px, 1fr))' columnGap={{ base: 3, lg: 4 }} rowGap={12}>
            {ProcessIds.map((election: string, idx: number) => (
              <ElectionProvider key={idx} id={election}>
                <ElectionCard />
              </ElectionProvider>
            ))}
          </Grid>
        )}
      </Box>
      <Text>{t('landing.desc_footer')}</Text>
      <Flex justifyContent='center' mt='auto'>
        <Image src={vocdoniIcon} width='200px' alt='vocdoni logo' />
      </Flex>
    </Flex>
  )
}

const ElectionCard = () => {
  const { election } = useElection()
  if (!election || !(election instanceof PublishedElection)) return
  return <ProcessCardDetailed election={election} />
}

export default Home
