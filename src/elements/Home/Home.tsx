import { Text, VStack } from '@chakra-ui/react'
import { ElectionTitle } from '@vocdoni/chakra-components'
import { ElectionProvider } from '@vocdoni/react-providers'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <VStack spacing={8}>
      <Text>This would be the landing page for multiple processes:</Text>
      {import.meta.env.PROCESS_IDS.map((id: string) => (
        <ElectionProvider id={id} key={id}>
          <Link to={`/${id}`}>
            <ElectionTitle />
          </Link>
        </ElectionProvider>
      ))}
    </VStack>
  )
}

export default Home
