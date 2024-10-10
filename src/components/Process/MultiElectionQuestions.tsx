import { SubElectionState, useMultiElections } from './MultiElectionContext'
import { ElectionProvider, useElection } from '@vocdoni/react-providers'
import { ComponentType, useEffect, useMemo } from 'react'
import { PublishedElection } from '@vocdoni/sdk'
import { ButtonProps } from '@chakra-ui/button'
import {
  ElectionQuestionsFormProps,
  ElectionQuestion,
  DefaultElectionFormId,
  VoteButtonLogic,
} from '@vocdoni/chakra-components'
import { Flex } from '@chakra-ui/react'

export type MultiElectionQuestionsFormProps = { ConnectButton?: ComponentType } & ElectionQuestionsFormProps

export const MultiElectionVoteButton = (props: ButtonProps) => {
  const { isAbleToVote, voting, voted } = useMultiElections()
  const election = useElection() // use Root election information

  return (
    <VoteButtonLogic
      electionState={{ ...election, voted, loading: { ...election.loading, voting }, isAbleToVote }}
      {...props}
    />
  )
}

export const MultiElectionQuestionsForm = ({
  formId,
  onInvalid,
  ConnectButton,
  ...props
}: MultiElectionQuestionsFormProps) => {
  const { voteAll, fmethods, renderWith } = useMultiElections()

  return (
    <form onSubmit={fmethods.handleSubmit(voteAll, onInvalid)} id={formId ?? DefaultElectionFormId}>
      {renderWith.length > 0 && (
        <Flex direction={'column'} gap={10}>
          {renderWith.map(({ id }) => (
            <ElectionProvider key={id} ConnectButton={ConnectButton} id={id} fetchCensus>
              <SubElectionQuestions {...props} />
            </ElectionProvider>
          ))}
        </Flex>
      )}
    </form>
  )
}

const SubElectionQuestions = (props: Omit<MultiElectionQuestionsFormProps, 'ConnectButton'>) => {
  const { rootClient, addElection, elections } = useMultiElections()
  const { election, setClient, vote, client, connected, clearClient, isAbleToVote, voted } = useElection()

  const subElectionState: SubElectionState | null = useMemo(() => {
    if (!election || !(election instanceof PublishedElection)) return null
    return {
      vote,
      election,
      isAbleToVote,
      voted,
    }
  }, [vote, election, isAbleToVote, voted])

  // clear session of local context when login out
  useEffect(() => {
    if (connected) return
    clearClient()
  }, [connected])

  // ensure the client is set to the root one
  useEffect(() => {
    setClient(rootClient)
  }, [rootClient, election])

  // Update election state cache
  useEffect(() => {
    if (!subElectionState || !subElectionState.election) return
    const actualState = elections[subElectionState.election.id]
    if (subElectionState.vote === actualState?.vote || subElectionState.isAbleToVote === actualState?.isAbleToVote) {
      return
    }
    addElection(subElectionState)
  }, [subElectionState, elections, election])

  return <ElectionQuestion {...props} />
}
