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
import { Flex, FormControl, FormErrorMessage, useMultiStyleConfig } from '@chakra-ui/react'
import { Controller, FieldValues, ValidateResult } from 'react-hook-form'

export type SubmitFormValidation = (values: Record<string, FieldValues>) => ValidateResult | Promise<ValidateResult>

export type MultiElectionQuestionsFormProps = {
  ConnectButton?: ComponentType
  validate?: SubmitFormValidation
} & ElectionQuestionsFormProps

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
  validate,
  ...props
}: MultiElectionQuestionsFormProps) => {
  const styles = useMultiStyleConfig('ElectionQuestions')
  const { voteAll, fmethods, renderWith } = useMultiElections()

  const { handleSubmit, control } = fmethods

  return (
    <form onSubmit={handleSubmit(voteAll, onInvalid)} id={formId ?? DefaultElectionFormId}>
      {renderWith.length > 0 && (
        <Flex direction={'column'} gap={10}>
          {renderWith.map(({ id }) => (
            <ElectionProvider key={id} ConnectButton={ConnectButton} id={id} fetchCensus>
              <SubElectionQuestions {...props} />
            </ElectionProvider>
          ))}
        </Flex>
      )}
      {/*This controller is a trick to perform a form additional validation.
       Adding the validation on the handleSubmit method caused UX errors when trying to rerun the validation again
        because the error was already on error state.
        On this way, the validation works as expected.*/}
      <Controller
        name={'handleSubmit'}
        control={control}
        rules={{
          validate: (field, formFields: Record<string, FieldValues>) => {
            if (validate) return validate(formFields)
            return true
          },
        }}
        render={({ fieldState: { error: fieldError } }) => {
          return (
            <FormControl isInvalid={!!fieldError?.message}>
              <FormErrorMessage sx={styles.error}>{fieldError?.message as string}</FormErrorMessage>
            </FormControl>
          )
        }}
      />
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
