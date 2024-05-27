import { Box, Flex, Text } from '@chakra-ui/react'
import { ElectionStatusBadge } from '@vocdoni/chakra-components'
import { useElection } from '@vocdoni/react-providers'
import { InvalidElection, PublishedElection, Strategy } from '@vocdoni/sdk'
import { ReactNode, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StampIcon } from './Census/StampIcon'
import omniumHeader from '/assets/omnium-header.png'

const ProcessHeader = () => {
  const { t } = useTranslation()
  const { election, voted } = useElection()
  const [daysToEndElection, setDaysToEndElection] = useState(-1)

  useEffect(() => {
    if (election instanceof InvalidElection) return

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
  }, [(election as PublishedElection)?.endDate])

  return (
    <Box mb={10} mt={3}>
      <Box
        bgImage={omniumHeader}
        w='100%'
        h={{ base: '200px', md: '300px' }}
        bgPosition='center'
        bgSize='cover'
        bgRepeat='no-repeat'
        mb={{ base: 5, lg2: 8 }}
      />

      <Box>
        <Flex flexDirection={{ base: 'column', sm: 'row' }} gap={{ base: 3, sm: 5 }} justifyContent='start' mb={10}>
          <ElectionStatusBadge px={4} justifyContent='center' fontWeight='bold' w='min-content' whiteSpace='nowrap' />
          {daysToEndElection !== -1 && <Text>{t('process.days_to_end', { count: daysToEndElection })}</Text>}
        </Flex>
        <Flex flexDirection='column' gap={4} fontSize='18px'>
          <Trans
            i18nKey='process.description'
            components={{
              p: <Text />,
              h1: <Text as='h1' color='#FF6320' fontSize='32px' fontWeight='extrabold' mt={10} />,
            }}
          />
          {!voted && <Text>Tria individualment els candidats que vols votar, o bé, vota en blanc.</Text>}
        </Flex>
      </Box>
    </Box>
  )
}

const GitcoinStrategyInfo = () => {
  const { t } = useTranslation()
  const { election } = useElection()

  if (!election || election instanceof InvalidElection || !election?.meta?.strategy) return

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

  if (!election || election instanceof InvalidElection || !election?.meta?.census) return ''

  const strategies: { [key: string]: ReactNode } = {
    spreadsheet: t('process.census_strategies.spreadsheet'),
    token: t('process.census_strategies.token', { token: election?.meta?.token }),
    web3: t('process.census_strategies.web3'),
    csp: t('process.census_strategies.csp'),
    gitcoin: <GitcoinStrategyInfo />,
  }
  const type = election.get('census.type')

  if (typeof strategies[type] === 'undefined') {
    console.warn('unknown census type:', type)
    return ''
  }

  return strategies[type]
}

export default ProcessHeader
