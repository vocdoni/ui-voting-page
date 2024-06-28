import {
  AspectRatio,
  Box,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'

import { useElection } from '@vocdoni/react-providers'
import { ElectionStatus, PublishedElection } from '@vocdoni/sdk'
import { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'
import ProcessAside from './Aside'
import { ChainedProcesses, ChainedResults } from './Chained'
import Header from './Header'
import { SuccessVoteModal } from './SuccessVoteModal'

export const ProcessView = () => {
  const { t } = useTranslation()
  const { election } = useElection()
  const videoRef = useRef<HTMLDivElement>(null)
  const [videoTop, setVideoTop] = useState(false)
  const electionRef = useRef<HTMLDivElement>(null)
  const [tabIndex, setTabIndex] = useState(0)
  const [formErrors, setFormErrors] = useState<any>(null)

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current) return

      const rect = videoRef.current.getBoundingClientRect()
      if (rect.top <= 84) {
        setVideoTop(true)
      } else {
        setVideoTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // If the election is finished show the results tab
  useEffect(() => {
    if (election instanceof PublishedElection && election?.status === ElectionStatus.RESULTS) {
      setTabIndex(1)
    }
  }, [election])

  // Move the focus of the screen to the first unanswered question
  useEffect(() => {
    if (!formErrors) return

    // We gather all the inputs
    const inputs = electionRef?.current?.getElementsByTagName('input')

    if (inputs) {
      const inputsArray = Array.from(inputs)

      // The formErrors object has keys that represent the error names, so we filter the inputsArray with the names of the inputs
      const inputsError = inputsArray.filter((el) => el.name === Object.keys(formErrors)[0])

      // We get the last input which is the closest to the error message
      const lastInputError = inputsError[inputsError.length - 1]

      // Once we have the first input, we calculate the new position
      const newPosition = window.scrollY + lastInputError.getBoundingClientRect().top - 200

      // We move the focus to the corresponding height
      window.scrollTo({
        top: newPosition,
        behavior: 'smooth',
      })
    }
  }, [formErrors])

  return (
    <Box>
      <Box className='site-wrapper'>
        <Header />

        {election instanceof PublishedElection && election?.streamUri && (
          <Box
            maxW={{ base: '800px', lg: videoTop ? '400px' : '800px' }}
            ml={videoTop ? 'auto' : 'none'}
            position={{ base: 'unset', lg: 'sticky' }}
            top={{ base: 0, lg2: 20 }}
            zIndex={100}
          >
            <AspectRatio ref={videoRef} ratio={16 / 9}>
              <ReactPlayer url={election?.streamUri} width='100%' height='100%' playing controls />
            </AspectRatio>
          </Box>
        )}

        <Flex direction={{ base: 'column', lg2: 'row' }} alignItems='start' gap={{ lg2: 10 }} mt={{ lg2: 20 }}>
          <Tabs
            order={{ base: 2, lg2: 1 }}
            variant='process'
            index={tabIndex}
            onChange={handleTabsChange}
            flexGrow={0}
            flexShrink={0}
            flexBasis={{ base: '100%', md: '60%', lg: '65%', lg2: '70%', xl2: '75%' }}
            w='full'
          >
            <TabList>
              <Tab>{t('process.questions')}</Tab>
              {election instanceof PublishedElection && election?.status !== ElectionStatus.CANCELED && (
                <Tab>{t('process.results')}</Tab>
              )}
            </TabList>
            <TabPanels>
              <TabPanel>
                <ChainedProcesses root={election} />
              </TabPanel>
              <TabPanel mb={20}>
                <ChainedResults root={election} />
              </TabPanel>
            </TabPanels>
            <Text textAlign='center' mx='auto' maxW='1150px' my={10}>
              <Trans
                i18nKey='process.footer_message'
                components={{
                  bold: <Text as='span' fontWeight='bold' />,
                  normal: <Text as='span' />,
                  customLink: (
                    <Link as={ReactRouterLink} to='' textDecor='underline' _hover={{ textDecoration: 'none' }} />
                  ),
                }}
              />
            </Text>
          </Tabs>
          <Flex
            flexGrow={1}
            flexDirection='column'
            alignItems={{ base: 'center', lg2: 'start' }}
            order={{ base: 1, lg2: 2 }}
            gap={0}
            mx={{ base: 'auto', lg2: 0 }}
            position={{ lg2: 'sticky' }}
            top={'300px'}
            mt={{ lg2: 10 }}
            maxW={{ lg2: '290px' }}
            mb={10}
          >
            <ProcessAside />
          </Flex>
        </Flex>
      </Box>

      <SuccessVoteModal />
    </Box>
  )
}

export const VotingVoteModal = () => {
  const { t } = useTranslation()
  const {
    loading: { voting },
  } = useElection()

  console.log(voting)
  return (
    <Modal isOpen={voting} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <VStack>
          <Spinner color='spinner' mb={5} w={10} h={10} />
        </VStack>
        <ModalBody>
          <Text textAlign='center'>{t('process.voting')}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
