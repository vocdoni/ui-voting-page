import { ElectionProvider, OrganizationProvider } from '@vocdoni/react-providers'
import { PublishedElection } from '@vocdoni/sdk'
import { useLoaderData } from 'react-router-dom'
import { ProcessView } from '~components/Process/View'

const Vote = () => {
  const election = useLoaderData() as PublishedElection

  return (
    <OrganizationProvider id={election.organizationId}>
      <ElectionProvider key='root-election' election={election} fetchCensus autoUpdate>
        <ProcessView />
      </ElectionProvider>
    </OrganizationProvider>
  )
}

export default Vote
