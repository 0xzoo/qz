import {
  useContext,
  // useState
} from "react"
import { useParams } from "react-router-dom"
import { useCollection, useDocument, usePolybase } from "@polybase/react"
import {
  Flex,
  Avatar,
  Tabs,
  Text,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  List,
  ListItem,
  useColorModeValue
} from '@chakra-ui/react'
import { Qz, Az } from "../types/types"
import { CollectionRecordReference } from "@polybase/client"
import { QCardSmall } from "../components/qCardSmall"
import { ACardSmall } from "../components/aCardSmall"
import { RootContext } from "./Root"

export interface ProfileProps {
  userId: string
}

export const Profile = () => {
  const polybase = usePolybase()
  const { userId } = useParams()
  const { data: userData } = useDocument(polybase.collection('User').record(userId as string))
  const rootContext = useContext(RootContext)
  const { setSearchParams, setQz } = rootContext
  const userName = userData?.data.name ? 
    userData.data.name : 
    userData?.data.email ?
      userData.data.email :
      userData?.data.id.slice(0,6)

  const owner: CollectionRecordReference = {
    collectionId: userData?.id as string,
    id: userData?.data.id as string
  }
  const qzQuery = polybase.collection('Qz').where("owner","==", owner).sort('timestamp', 'desc')
  const { data: qzData } = useCollection<Qz>(qzQuery)
  // Should depend on if user is following
  const azQuery = polybase.collection('PubAz').where("owner","==", owner).sort('timestamp', 'desc')
  const { data: azData } = useCollection<Az>(azQuery)
  console.log(azData)

  const borderColor = useColorModeValue('gray.300','gray.600')


  return ( userData && (
    <Flex
      flexDir={['column','row']}
      overflowY={'hidden'}
      >
      <Flex
        flexDir={'column'}
      >
        <Flex
          flexDir={'row'}
          alignItems={'center'}
          p={4}
        >
          <Avatar mr={2}/>
          <Text>{userName}</Text>
        </Flex>
      </Flex>
      <Tabs
        isLazy
        lazyBehavior={'keepMounted'}
        colorScheme={'linkedin'}
        display={'flex'}
        flexDir={'column'}
        id="SwipeController"
        // overflowX={'hidden'}
        overflowY={'hidden'}
        p={0}
        w={['100vw', 400, 500]}
        // {...swipeHandlers}
      >
        <TabList>
          <Tab>Qz</Tab>
          <Tab>Az</Tab>
        </TabList>
        <TabPanels
          overflowY={'scroll'}
        >
          <TabPanel>
            <List>
              { qzData?.data.map((res: any, i: number) => {
                const params = { q: res.data.id }
                const onClick = () => {
                  setSearchParams(params)
                  setQz(qzData.data)
                }
                
                return (
                  <ListItem key={i}>
                    <QCardSmall borderColor={borderColor} onClick={onClick} q={res.data} />
                  </ListItem>
                )
              })}
            </List>
          </TabPanel>
          <TabPanel>
            <List>
            { azData?.data.map((res: any, i: number) => {
                const params = { a: res.data.id }
                const onClick = () => {
                  setSearchParams(params)
                }
                
                return (
                  <ListItem key={i}>
                    <ACardSmall borderColor={borderColor} onClick={onClick} a={res.data} />
                  </ListItem>
                )
              })}
            </List>
          </TabPanel>
        </TabPanels>

      </Tabs>
    </Flex>
  ))
}