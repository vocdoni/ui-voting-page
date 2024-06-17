import { Box, Progress } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ElectionQuestions, ElectionResults, SpreadsheetAccess } from '@vocdoni/chakra-components'
import { ElectionProvider, useElection } from '@vocdoni/react-providers'
import { ArchivedElection, InvalidElection, IVotePackage, PublishedElection, VocdoniSDKClient } from '@vocdoni/sdk'
import { useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import { VoteButton } from './Aside'
import { ChainedProvider, useChainedProcesses } from './ChainedContext'
import { ConfirmVoteModal } from './ConfirmVoteModal'
import { VotingVoteModal } from './View'

type ChainedProcessesInnerProps = {
  connected: boolean
}

const ChainedProcessesInner = ({ connected }: ChainedProcessesInnerProps) => {
  const { election, voted, setClient, clearClient } = useElection()
  const { processes, client, current, setProcess, setCurrent } = useChainedProcesses()

  // clear session of local context when login out
  useEffect(() => {
    if (connected) return
    clearClient()
  }, [connected])

  // ensure the client is set to the root one
  useEffect(() => {
    setClient(client)
  }, [client, election])

  // fetch current process and process flow logic
  useEffect(() => {
    if (!current || processes[current] instanceof InvalidElection || !voted) return

    const currentElection = processes[current]
    const meta = currentElection.get('multiprocess')
    if (!meta || (!meta.root && !meta.conditions && !meta.default)) return
    ;(async () => {
      // fetch votes info
      const next = await getNextProcessInFlow(client, voted, meta)

      if (typeof processes[next] === 'undefined') {
        const election = await client.fetchElection(next)
        setProcess(next, election)
        setCurrent(next)
      }
    })()
  }, [processes, current, voted, client])

  if (!current || !processes[current]) {
    return <Progress w='full' size='xs' isIndeterminate />
  }

  if (processes[current] instanceof InvalidElection) {
    return <Trans i18nKey='error.election_is_invalid'>Invalid election</Trans>
  }

  return (
    <Box className='md-sizes' mb='50px' pt='25px'>
      <ElectionQuestions
        confirmContents={(election, answers) => <ConfirmVoteModal election={election} answers={answers} />}
      />
      <Box
        bottom={0}
        left={0}
        pt={1}
        position={{ base: 'sticky', lg2: 'relative' }}
        bgColor={{ base: 'white', lg2: 'transparent' }}
      >
        <VoteButton />
      </Box>

      <VotingVoteModal />
    </Box>
  )
}

type ChainedProcessesProps = {
  root?: PublishedElection | ArchivedElection | InvalidElection
}

export const ChainedProcesses = ({ root }: ChainedProcessesProps) => {
  const { client } = useElection()
  if (!root) {
    return <Progress w='full' size='xs' isIndeterminate />
  }

  return (
    <ChainedProvider root={root as PublishedElection} client={client}>
      <ChainedProcessesWrapper />
    </ChainedProvider>
  )
}

export const ChainedResults = ({ root }: ChainedProcessesProps) => {
  const { client } = useElection()
  if (!root) {
    return <Progress w='full' size='xs' isIndeterminate />
  }

  return (
    <ChainedProvider root={root as PublishedElection} client={client}>
      <ChainedResultsWrapper />
    </ChainedProvider>
  )
}

const ChainedProcessesWrapper = () => {
  // note election context refers to the root election here, ALWAYS
  const { connected, election } = useElection()
  const { processes, current, reset } = useChainedProcesses()

  // set current to root if login out
  useEffect(() => {
    if (connected) return

    reset()
  }, [connected])

  if (!current || !processes[current] || !election || election instanceof InvalidElection) {
    return <Progress w='full' size='xs' isIndeterminate />
  }

  return (
    <>
      <ElectionProvider key={current} election={processes[current]} ConnectButton={ConnectButton} fetchCensus>
        <ChainedProcessesInner connected={connected} />
      </ElectionProvider>
      <Box
        bottom={0}
        left={0}
        pt={1}
        position={{ base: 'sticky', lg2: 'relative' }}
        bgColor={{ base: 'white', lg2: 'transparent' }}
      >
        {!connected && election.get('census.type') === 'spreadsheet' && <SpreadsheetAccess />}
      </Box>
    </>
  )
}

const ChainedResultsWrapper = () => {
  // note election context refers to the root election here, ALWAYS
  const { election, client } = useElection()
  const { processes, setProcess } = useChainedProcesses()
  const [loaded, setLoaded] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [sorted, setSorted] = useState<string[]>([])

  useEffect(() => {
    if (!election || election instanceof InvalidElection || loading || loaded) return
    setLoading(true)
    ;(async () => {
      const { processes: fetchedProcesses, ids } = await getAllProcessesInFlow(client, election)
      for (const process of fetchedProcesses) {
        setProcess(process.id, process)
      }
      setSorted(ids)
      setLoaded(true)
      setLoading(false)
    })()
  }, [election])

  if (!loaded) {
    return <Progress w='full' size='xs' isIndeterminate />
  }

  return (
    <>
      {sorted.map((id) => (
        <ElectionProvider key={id} election={processes[id]}>
          <ElectionResults />
        </ElectionProvider>
      ))}
    </>
  )
}

// Note this logic has been thought for single-choice single-question processes.
// The brainfuck required to make it work for other implementations requires a
// thoroughful assessment of the entire feature.
// Also, processes cannot be secret... otherwise we cannot get the vote packages
// and know what the users voted
const getNextProcessInFlow = async (client: VocdoniSDKClient, voted: string, meta: any) => {
  if (!meta.conditions) {
    return meta.default
  }

  const ivote = await client.voteService.info(voted)

  if (!(ivote.package as IVotePackage).votes) {
    throw new Error('vote package is secret, cannot continue with the flow')
  }

  const [choice] = (ivote.package as IVotePackage).votes

  // loop over conditions finding the selected choice
  for (const condition of meta.conditions) {
    if (choice === condition.choice && condition.question === 0) {
      return condition.goto
    }
  }

  return meta.default
}

const getProcessIdsInFlowStep = (meta: FlowNode) => {
  const ids: string[] = []

  ids.push(meta.default)

  if (!meta.conditions) {
    return ids
  }

  for (const condition of meta.conditions) {
    ids.push(condition.goto)
  }

  return ids
}

export const getAllProcessesInFlow = async (
  client: VocdoniSDKClient,
  election: PublishedElection
): Promise<{ processes: PublishedElection[]; ids: string[] }> => {
  const processes: { [key: string]: PublishedElection } = {}
  const ids: string[] = []
  const visited = new Set<string>()

  const loadProcess = async (id: string) => {
    if (!processes[id]) {
      const election = await client.fetchElection(id)
      processes[id] = election

      const meta = election.get('multiprocess')
      if (meta && meta.default && !visited.has(meta.default)) {
        const idsToFetch = getProcessIdsInFlowStep(meta)
        for (const nextId of idsToFetch) {
          await loadProcess(nextId)
        }

        // Add conditions first
        if (meta.conditions) {
          for (const condition of meta.conditions) {
            if (!visited.has(condition.goto)) {
              visited.add(condition.goto)
              ids.push(condition.goto)
            }
          }
        }

        // Add defaults after conditions
        if (!visited.has(meta.default)) {
          visited.add(meta.default)
          ids.push(meta.default)
        }
      }
    }
  }

  const meta = election.get('multiprocess')
  const initialIds = [election.id, ...getProcessIdsInFlowStep(meta)]
  for (const id of initialIds) {
    await loadProcess(id)
  }

  ids.push(election.id)

  return { processes: Object.values(processes), ids: ids.reverse() }
}

type FlowCondition = {
  question: number
  choice: number
  goto: string
}

type FlowNode = {
  default: string
  conditions?: FlowCondition[]
}
