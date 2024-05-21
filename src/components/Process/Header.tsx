import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { ElectionStatusBadge } from '@vocdoni/chakra-components'
import { useElection } from '@vocdoni/react-providers'
import { Strategy } from '@vocdoni/sdk'
import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useReadMoreMarkdown } from '~components/Layout/use-read-more'
import { StampIcon } from './Census/StampIcon'
import omniumHeader from '/assets/omnium-header.png'
import omniumLogo from '/assets/omnium-logo.png'

const ProcessHeader = () => {
  const { t } = useTranslation()
  const { election } = useElection()
  const { ReadMoreMarkdownWrapper, ReadMoreMarkdownButton } = useReadMoreMarkdown(
    'rgba(242, 242, 242, 0)',
    'rgba(242, 242, 242, 1)',
    600,
    20
  )
  const [daysToEndElection, setDaysToEndElection] = useState(-1)

  useEffect(() => {
    const startDate = new Date()
    const endDate = election?.endDate

    if (!endDate) return
    const startTime = startDate.getTime()
    const endTime = endDate.getTime()

    // Calcular la diferencia en milisegundos
    const differenceInMilliseconds = endTime - startTime

    // Convertir la diferencia de milisegundos a días
    const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24)

    if (differenceInDays >= 0) {
      setDaysToEndElection(Math.floor(differenceInDays))
    } else {
      setDaysToEndElection(-1)
    }
  }, [election?.endDate])
  return (
    <Box mb={10}>
      <Box
        w='100%'
        maxW={{ base: '150px', md: '200px', lg2: '300px' }}
        marginLeft={{ lg2: '70px' }}
        maxH='300px'
        overflow='hidden'
        mb={{ base: 3, md: 5, lg2: 8 }}
      >
        <Image src={omniumLogo} w='100%' h='auto' objectFit='cover' alt='omnium logo' />
      </Box>
      <Box
        w='100%'
        maxH={{ base: '100px', md: '250px' }}
        mx='auto'
        overflow='hidden'
        borderTopRadius='20px'
        mb={{ base: 5, lg2: 8 }}
      >
        <Image src={omniumHeader} w='100%' h='auto' alt='assemblea general omium' />
      </Box>
      <Box>
        <Flex flexDirection={{ base: 'column', sm: 'row' }} gap={{ base: 3, sm: 5 }} justifyContent='start' mb={10}>
          <ElectionStatusBadge px={4} justifyContent='center' fontWeight='bold' w='min-content' whiteSpace='nowrap' />
          {daysToEndElection !== -1 && <Text>{t('process.days_to_end', { count: daysToEndElection })}</Text>}
        </Flex>
        <Flex flexDirection='column' gap={4} fontSize='18px'>
          <Text>
            Benvingut/da a la pàgina de votacions per actualitzar la composició de membres de la Junta Directiva.
          </Text>
          <Text>
            S’ha presentat una sola candidatura per a les eleccions a la Junta Directiva, conformada per 19 persones.
            Les votacions es fan pel sistema de llistes obertes, és a dir, cal indicar el sentit de la votació persona a
            persona.
          </Text>
          <Text>
            Per poder emetre correctament els vostres vots cal que respongueu les diferents votacions i cliqueu el botó
            “Finalitzar la votació” que trobareu al final d’aquesta pàgina.
          </Text>
          <Text as='h1' color='#FF6320' fontSize='32px' fontWeight='extrabold' mt={10}>
            Eleccions a la Junta Directiva
          </Text>
        </Flex>
      </Box>
    </Box>
  )
}

const GitcoinStrategyInfo = () => {
  const { t } = useTranslation()
  const { election } = useElection()

  if (!election || (election && !election?.meta?.strategy)) return
  const strategy: Strategy = election.get('strategy')

  const score = strategy.tokens['GPS'].minBalance
  const firstParenthesesMatch = strategy.predicate.match(/\(([^)]+)\)/)
  let unionTypeString: string | null = null
  if (firstParenthesesMatch) {
    // split by space and get the second element which should be the union type
    const [, unionType] = firstParenthesesMatch[1].split(' ')
    if (unionType === 'AND') {
      unionTypeString = t('process.gitcoin.all_of_them')
    } else if (unionType === 'OR') {
      unionTypeString = t('process.gitcoin.one_of_them')
    }
  }
  const tokens = Object.entries(strategy.tokens).filter(([key, token]) => key !== 'GPS')

  return (
    <>
      <Text>{t('process.gitcoin.gps_score', { score: score })}</Text>
      {unionTypeString && (
        <Flex direction={'column'} gap={2} mt={4}>
          <Flex direction={{ base: 'column', lg: 'row' }} gap={{ base: 0, lg: 1 }}>
            <Text fontWeight='bold'>{t('process.gitcoin.needed_stamps')}</Text>
            <Text>{unionTypeString}</Text>
          </Flex>
          <Flex direction={'row'} gap={1} flexWrap={'wrap'}>
            {Object.values(tokens).map(([, token], n) => {
              return (
                <StampIcon key={n} size={6} iconURI={token.iconURI} alt={token.externalID} tooltip={token.externalID} />
              )
            })}
          </Flex>
        </Flex>
      )}
    </>
  )
}

const useStrategy = () => {
  const { t } = useTranslation()
  const { election } = useElection()
  const strategies: { [key: string]: ReactNode } = {
    spreadsheet: t('process.census_strategies.spreadsheet'),
    token: t('process.census_strategies.token', { token: election?.meta?.token }),
    web3: t('process.census_strategies.web3'),
    csp: t('process.census_strategies.csp'),
    gitcoin: <GitcoinStrategyInfo />,
  }

  if (!election || (election && !election?.meta?.census)) return ''

  const type = election.get('census.type')

  if (typeof strategies[type] === 'undefined') {
    console.warn('unknown census type:', type)
    return ''
  }

  return strategies[type]
}

export default ProcessHeader
