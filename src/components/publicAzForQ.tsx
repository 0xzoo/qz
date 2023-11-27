import {
  usePolybase,
  useCollection
} from '@polybase/react'
import {
  List,
  ListItem,
  Flex,
  Box,
  Link,
  Text
} from '@chakra-ui/react'
import {
  Qz,
  Az
} from '../types/types'
import { CollectionRecordResponse } from '@polybase/client'
import { AzBarChart } from './azBarChart'
import { namespace } from '../App'


type PublicAzForQProps = {
  currentQ: Qz
}

export const PublicAzForQ = (props: PublicAzForQProps) => {
  const polybase = usePolybase()
  const currentQ = props.currentQ
  const currentQType = currentQ.type
  const qId = {
    collectionId: namespace + '/Qz',
    id: currentQ.id
  }

  const pubAzCollectionReference = polybase.collection('PubAz')
  const pubAzQuery = pubAzCollectionReference
    .where("qId", "==", qId)
    .where("edited","==",false)
    .sort('timestamp', 'desc')
  const { data } = useCollection<Az>(pubAzQuery)

  switch(currentQType) {
    case 'mc':
      return (
        <AzBarChart data={data} currentQ={currentQ}/>
      )
    case 'text':
      return (
        <List>
          {data && data.data.map((res: CollectionRecordResponse<Az>, index: number) => {
            return (
              <ListItem key={index}>
                <Flex
                  direction={'column'}
                  pos={'relative'}
                  borderBottom='1px solid'
                  borderColor='gray.500'
                  p={3}
                  pt={1}
                  pb={1}
                  justifyContent={'space-between'}
                  w={'100%'}
                >
                  <Box
                    p={0}
                    pt={6}
                    pb={6}
                  >
                    <Link><Text fontSize={'sm'}>{res.data.value}</Text></Link>
                    <Text fontSize={'xs'}>by <Link>{res.data.owner?.name ? res.data.owner?.name : res.data.owner?.id.slice(0,6)}</Link></Text>
                  </Box>
                </Flex>
              </ListItem>
            )
          })}
        </List>
      )
      case 'scale':
        return (
          <List>
            {data && data.data.map((res: CollectionRecordResponse<Az>, index: number) => {
              return (
                <ListItem key={index}>
                  <Flex
                    direction={'column'}
                    pos={'relative'}
                    borderBottom='1px solid'
                    borderColor='gray.500'
                    p={3}
                    pt={1}
                    pb={1}
                    justifyContent={'space-between'}
                    w={'100%'}
                  >
                    <Box
                      p={0}
                      pt={6}
                      pb={6}
                    >
                      <Link><Text fontSize={'sm'}>{res.data.value}</Text></Link>
                      <Text fontSize={'xs'}>by <Link>{res.data.owner?.name ? res.data.owner.name : res.data.owner?.id.slice(0,6)}</Link></Text>
                    </Box>
                  </Flex>
                </ListItem>
              )
            })}
          </List>
        )
  }
}