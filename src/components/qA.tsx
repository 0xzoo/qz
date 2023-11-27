import {
  Box,
  Heading,
  Divider,
  Flex,
  HStack,
  Icon,
  Text,
  Link,
  // Textarea,
  // Collapse,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  PublicAIcon,
  PrivateAIcon,
  ForkIcon,
  FollowUpIcon
} from '../assets/icons'
import { QAView } from './qAView'
import { QAProps, QAViews } from '../types/types'
import { useState } from 'react'
// import { CollectionRecordResponse } from '@polybase/client'
import { Link as ReactRouterLink } from 'react-router-dom'

// ------------------------------------------

export const QA = (props: QAProps) => {
  // const [ value, setValue ] = useState<string>()
  const [ qAView, setQAView ] = useState<QAViews>(QAViews.RESPOND)

  const {
    currentQ
  } = props
  const stem = currentQ?.stem
  const owner = currentQ?.owner // !fix in db - 0x...d34d?


  const handleQAViewChange = (view: QAViews) => {
    setQAView(view)
  }

  const qAViewProps = {
    handleQAViewChange,
    qAView,
    ...props
  }

  return (
    <Flex
      direction={'column'}
      justifyContent={'space-between'}
      h={'100%'}
      w={'100%'}
      flexShrink={0}
    >
      <Flex
        flexDir={'column'}
        flexGrow={2}
        p={4}
        pt={1}
        pb={1}
        alignItems={'center'}
      >
        <Box
          p={6}
          mt={'auto'}
          mb={'auto'}
        >
          <Heading
            fontSize={'3xl'}
            lineHeight={'shorter'}
            textAlign={'left'}
            fontFamily={'Libre Franklin'}
            color={useColorModeValue('gray.900', 'white')}
            maxW={'750px'}
          >
            {stem}
          </Heading>
        </Box>
        <Flex
          flexDir={['column','row']}
          justifyContent={'space-between'}
          flexGrow={0}
          w={'100%'}
        >
          <Box>
            <Text mb={[2,0]}>
              by{' '}
              <Link
                as={ReactRouterLink}
                to={owner?.id || '4n0n'}
              >
                {owner?.name ? owner?.name : owner?.id.slice(0,6)}
              </Link>
            </Text>
          </Box>
          <Flex
            flexDir={'row'}
            justifyContent={'space-between'}
          >
            <Box
              cursor={'pointer'}
              onClick={() => handleQAViewChange(QAViews.RESPOND)}
            >
              +
            </Box>
            <HStack
              ml={[6,9]}
              cursor={'pointer'}
              onClick={() => handleQAViewChange(QAViews.PUBLIC)}
            >
              <Icon as={PublicAIcon} />
              <Text noOfLines={1}>{currentQ?.pubAz}</Text>
            </HStack>
            <HStack ml={[6,9]}>
              <Icon as={PrivateAIcon} />
              <Text noOfLines={1}>{currentQ?.prvAz}</Text>
            </HStack>
            <HStack
              ml={[6,9]}
              cursor={'pointer'}
              onClick={() => handleQAViewChange(QAViews.FORKS)}
            >
              <Icon as={ForkIcon} />
              <Text noOfLines={1}>{currentQ?.forks.length}</Text>
            </HStack>
            <HStack
              ml={[6,9]}
              cursor={'pointer'}
              onClick={() => handleQAViewChange(QAViews.FUPS)}
            >
              <Icon as={FollowUpIcon} />
              <Text noOfLines={1}>{currentQ?.followUps.length}</Text>
            </HStack>
          </Flex>
        </Flex>
      </Flex>
      <Divider mx={[0,4]} w={'auto'}/>
      <Flex
        flexDir={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <QAView {...qAViewProps} /> {/* // !fix */}
      </Flex>
    </Flex>
  )
}