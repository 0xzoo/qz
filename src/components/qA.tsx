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
import { QAView, QAViews } from './qAView'
import { Az, Qz } from '../types/types'
import React, { useCallback, useState } from 'react'
import { CollectionRecordResponse } from '@polybase/client'


type QAProps = {
  qIndex: number | undefined
  handleMcRadio: (i: string) => void
  handleIsPrivate: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleImportance: (i: number) => void
  value: string
  handleValue: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  initialRef: React.MutableRefObject<null>
  currentQ: Qz,
  userAz: CollectionRecordResponse<Az>[] | undefined
}

// ------------------------------------------

export const QA = (props: QAProps) => {
  // const [ value, setValue ] = useState<string>()
  const [ qAView, setQAView ] = useState<QAViews>(QAViews.RESPOND)

  const {
    // handleValue,
    currentQ
  } = props

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
      minH={'100%'}
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
          >
            {currentQ?.stem}
          </Heading>
        </Box>
        <Flex
          flexDir={['column','row']}
          justifyContent={'space-between'}
          flexGrow={0}
          w={'100%'}
        >
          <Box>
            <Text mb={[2,0]}>by <Link>{currentQ?.owner.name ? currentQ?.owner.name : currentQ?.owner.id.slice(0,6)}</Link></Text>
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
      <QAView {...qAViewProps} /> {/* // !fix */}
    </Flex>
  )
}