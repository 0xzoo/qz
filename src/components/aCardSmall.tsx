import {
  Flex,
  Link,
  Box,
  Text
} from '@chakra-ui/react'
import { Az } from '../types/types'
import { usePolybase, useDocument } from '@polybase/react'

type aCardProps = {
  borderColor: string
  onClick: () => void
  a: Az
}
 
 
export const ACardSmall = (props: aCardProps) => {
  const { borderColor, onClick, a } = props
  const polybase = usePolybase()
  const qQuery = polybase.collection('Qz').record(a.qId.id)
  const { data: q } = useDocument(qQuery)
  const answer = a.value ? 
    a.value
  : q?.data.az[a.qIndex as number]
    

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
          p={0}
          pt={6}
          pb={6}
        >
          <Text fontSize={'sm'}>
            {q?.data.stem}
          </Text>
          <Text fontSize='md'>
            {answer}
          </Text>
        </Box>
      </Link>
    </Flex>
  )
}