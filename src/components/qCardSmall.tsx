import {
  Flex,
  Link,
  Box,
  HStack,
  Icon,
  Text
} from '@chakra-ui/react'
import {
  PublicAIcon,
  PrivateAIcon,
  ForkIcon,
  FollowUpIcon
} from '../assets/icons'
import { Qz } from '../types/types'

type qCardProps = {
  borderColor: string
  onClick: () => void
  q: Qz
}
 
 
export const QCardSmall = (props: qCardProps) => {
  const { borderColor, onClick, q } = props

  return (
    <Flex
      direction={'column'}
      pos={'relative'}
      borderBottom='1px solid'
      borderColor={borderColor}
      p={3}
      pt={1}
      pb={1}
      justifyContent={'space-between'}
      w={'100%'}
    >
      <Link
        // as={RouterLink}
        // to={path}
        _hover={{ textDecor: 'none' }}
        onClick={onClick}
      >
        <Box
          p={2}
          py={9}
        >
          <Text
            fontSize='md'
            fontWeight={600}
          >
            {q.stem}
          </Text>
        </Box>
      </Link>
      <HStack
        spacing={4}
        pos={'absolute'}
        right={4}
        bottom={0}
      >
        <HStack spacing={1}>
          <Icon as={PublicAIcon} />
          <Text>{q.pubAz}</Text>
        </HStack>
        <HStack spacing={1}>
          <Icon as={PrivateAIcon} />
          <Text>{q.prvAz}</Text>
        </HStack>
        <HStack spacing={1}>
          <Icon as={ForkIcon} />
          <Text>{q.forks.length}</Text>
        </HStack>
        <HStack spacing={1}>
          <Icon as={FollowUpIcon} />
          <Text>{q.followUps.length}</Text>
        </HStack>
      </HStack>
    </Flex>
  )
}