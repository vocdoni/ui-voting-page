import { Button, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <VStack spacing={8}>
      <Text>This would be the landing page for multiple processes:</Text>
      {import.meta.env.PROCESS_IDS.map((id: string) => (
        <Link to={`/${id}`} key={id}>
          <Button>{id}</Button>
        </Link>
      ))}
    </VStack>
  )
}

export default Home
