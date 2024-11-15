import { Box, Flex, Progress, useBreakpointValue } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
  ElectionQuestions,
  ElectionResults,
  QuestionsFormProvider,
  RenderWith,
  SpreadsheetAccess,
} from '@vocdoni/chakra-components'
import { ElectionProvider, useElection } from '@vocdoni/react-providers'
import { InvalidElection, IVotePackage, PublishedElection, VocdoniSDKClient } from '@vocdoni/sdk'
import { PropsWithChildren, useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import { VoteButton } from '~components/Process/Aside'
import BlindCSPConnect from '~components/Process/BlindCSPConnect'
import { ConfirmVoteModal } from '~components/Process/ConfirmVoteModal'
import { MultiElectionSuccessVoteModal, SuccessVoteModal } from '~components/Process/SuccessVoteModal'
import VotingVoteModal, { MultiElectionVotingVoteModal } from '~components/Process/VotingVoteModal'
import { ChainedProvider, useChainedProcesses } from './ChainedContext'
import { ParitaryErcQuestionsForm } from '~components/Process/ParitaryErc'

type ChainedProcessesInnerProps = {
  connected: boolean
}

const VoteButtonContainer = ({ children }: PropsWithChildren) => {
  const isBreakPoint = useBreakpointValue({ base: true, lg2: false })
  if (isBreakPoint) {
    return (
      <Box
        position='sticky'
        bottom={0}
        left={0}
        bgColor='process.aside.aside_footer_mbl_border'
        pt={1}
        display={isBreakPoint ? 'block' : 'none'}
      >
        {children}
      </Box>
    )
  }
  return (
    <Box position='sticky' bottom={0} left={0} pb={1} pt={1} display={isBreakPoint ? 'none' : 'block'}>
      {children}
    </Box>
  )
}

const ChainedProcessesInner = ({ connected }: ChainedProcessesInnerProps) => {
  const { election, voted, setClient, clearClient } = useElection()
  const { processes, client, current, setProcess, setCurrent, root } = useChainedProcesses()

  // clear session of local context when login out
  useEffect(() => {
    if (connected) return
    clearClient()
  }, [connected])

  // ensure the client is set to the root one
  useEffect(() => {
    if (election.id !== root.id) {
      setClient(client)
    }
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

      if (typeof next === 'undefined') return // If cannot found next process, return
      if (typeof processes[next] === 'undefined') {
        const election = await client.fetchElection(next)
        setProcess(next, election)
        setCurrent(next)
      }
    })()
  }, [processes, current, voted, client])

  const [renderWith, setRenderWith] = useState<RenderWith[]>([])
  // Effect to set renderWith component state.
  useEffect(() => {
    if (!current || processes[current] instanceof InvalidElection) return
    const currentElection = processes[current]
    const meta = currentElection.get('multiprocess')
    if (meta && meta.renderWith) {
      setRenderWith(meta.renderWith)
    }
  }, [current, processes])
  const isRenderWith = renderWith.length > 0

  if (!current || !processes[current]) {
    return <Progress w='full' size='xs' isIndeterminate />
  }

  if (processes[current] instanceof InvalidElection) {
    return <Trans i18nKey='error.election_is_invalid'>Invalid election</Trans>
  }

  if (isRenderWith) {
    return (
      <QuestionsFormProvider
        renderWith={renderWith}
        confirmContents={(elections, answers) => <ConfirmVoteModal elections={elections} answers={answers} />}
      >
        <Flex direction={'column'} gap={{ base: 16, md: 24 }}>
          <ParitaryErcQuestionsForm />
          <VoteButtonContainer>
            <VoteButton />
          </VoteButtonContainer>
        </Flex>
        <MultiElectionVotingVoteModal />
        <MultiElectionSuccessVoteModal />
      </QuestionsFormProvider>
    )
  }

  return (
    <>
      <ElectionQuestions
        confirmContents={(elections, answers) => <ConfirmVoteModal elections={elections} answers={answers} />}
      />
      <VoteButtonContainer>
        <VoteButton />
      </VoteButtonContainer>
      <VotingVoteModal />
      <SuccessVoteModal />
    </>
  )
}

type ChainedProcessesProps = {
  root?: PublishedElection | InvalidElection
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

  if (processes[current] instanceof InvalidElection) {
    return <Trans i18nKey='error.election_is_invalid'>Invalid election</Trans>
  }

  const isBlindCsp = election.get('census.type') === 'csp' && election?.meta.csp?.service === 'vocdoni-blind-csp'

  return (
    <Box className='md-sizes' mb='100px' pt='25px'>
      {current === election.id ? (
        <ChainedProcessesInner connected={connected} />
      ) : (
        <ElectionProvider key={current} election={processes[current]} ConnectButton={ConnectButton} fetchCensus>
          <ChainedProcessesInner connected={connected} />
        </ElectionProvider>
      )}
      <VoteButtonContainer>
        <Flex justifyContent='center' alignItems='center' direction={'column'} py={3} px={{ base: 3, lg2: 0 }}>
          {!connected && election.get('census.type') === 'spreadsheet' && <SpreadsheetAccess />}
          {isBlindCsp && !connected && <BlindCSPConnect />}
        </Flex>
      </VoteButtonContainer>
    </Box>
  )
}

const ChainedResultsWrapper = () => {
  // note election context refers to the root election here, ALWAYS
  const { election, client, voted } = useElection()
  const { processes, setProcess } = useChainedProcesses()
  const [loaded, setLoaded] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [sorted, setSorted] = useState<string[]>([])

  // Get elections information
  useEffect(() => {
    if (!election || election instanceof InvalidElection || loading || loaded) return

    setLoading(true)
    ;(async () => {
      try {
        const { processes: fetchedProcesses, ids } = await getAllProcessesInFlow(client, election)
        for (const process of fetchedProcesses) {
          setProcess(process.id, process)
        }
        setSorted(ids)
      } catch (e) {
        console.error('error fetching chained processes', e)
      } finally {
        setLoaded(true)
        setLoading(false)
      }
    })()
  }, [election])

  // Reset loaded state when root election voted changes.
  // On renderWith elections this will update all the render elections.
  // However, this fix won't work on chained processes since we should check voted state for all processes to update
  // results on real time.
  useEffect(() => {
    if (voted) {
      setLoaded(false)
    }
  }, [voted])

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

  if (meta.default) {
    ids.push(meta.default)
  }

  if (meta.renderWith) {
    for (const renderWith of meta.renderWith) {
      ids.push(renderWith.id)
    }
  }

  if (meta.conditions) {
    for (const condition of meta.conditions) {
      ids.push(condition.goto)
    }
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
      if (meta && (meta.default || meta.renderWith) && !visited.has(meta.default)) {
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

        // Add renderWith processes
        if (meta.renderWith) {
          for (const renderWithElection of meta.renderWith as RenderWith[]) {
            if (!visited.has(renderWithElection.id)) {
              visited.add(renderWithElection.id)
              ids.push(renderWithElection.id)
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
  const initialIds = [election.id]
  if (meta) {
    initialIds.push(...getProcessIdsInFlowStep(meta))
  }

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

// FlowNode can have or conditions or renderWith, but not both
export type FlowNode =
  | {
      conditions?: FlowCondition[]
      renderWith?: never
      default: string
    }
  | {
      conditions?: never
      renderWith: RenderWith[]
      default?: string // Default is optional for renderWith elections
    }
