import {
  useContext, useEffect, useState
} from "react"
import { useParams } from "react-router-dom"
import { useAuth, useCollection, useDocument, usePolybase } from "@polybase/react"
import {
  Flex,
  Avatar,
  Tabs,
  Text,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
  List,
  ListItem,
  useColorModeValue,
  Box,
  Button
} from '@chakra-ui/react'
import { Qz, Az } from "../types/types"
import { 
  CollectionRecordReference,
  CollectionRecordResponse
} from "@polybase/client"
import { QCardSmall } from "../components/qCardSmall"
import { ACardSmall } from "../components/aCardSmall"
import { RootContext } from "./Root"
import { polybase } from "../App"
// export interface ProfileProps {
//   userId: string
// }
const smW = '100%'
const mdW = 500
const lW = 700
const wArray = [smW, mdW, lW]

async function checkFollowing (userId: string, profileId: string) {
  const record: CollectionRecordResponse<any, any> = await polybase.collection("Following").record(profileId + '/' + userId).get().catch((e) => {throw(e)})
  const { data: follower } = record

  return follower ? true : false
}

export const Profile = () => {
  const polybase = usePolybase()
  const { userId: profileId } = useParams()
  const rootContext = useContext(RootContext)
  const { state } = useAuth()
  console.log('authState', state)
  const userId = state && state.userId
  const [ following, setFollowing ] = useState<boolean>(false)

  // Css vars
  const borderColor = useColorModeValue('gray.300','gray.600')
  const buttonColor = useColorModeValue('white','gray.800')
  const buttonBgColor =  useColorModeValue('linkedin.500','linkedin.200')

  // Get user profile data
  const { data: profileData } = useDocument(polybase.collection('User').record(profileId as string))

  // Get pins data
  const pinsQuery = polybase.collection('Pins').where("pinner","==", profileId as string)
  const { data: pins } = useCollection(pinsQuery)

  // Get followers list and check if following
  const followersQuery = polybase.collection('Followers').where("followee","==", profileId as string)
  const { data: followers } = useCollection(followersQuery)

  // Get qz by Profile Owner
  const owner: CollectionRecordReference = {
    collectionId: profileData?.id as string,
    id: profileId as string
  }
  const qzQuery = polybase.collection('Qz').where("owner","==", owner).sort('timestamp', 'desc')
  const { data: qzData } = useCollection<Qz>(qzQuery)

  // Get az by Profile Owner
  // Should depend on if user is following
  const azQuery = polybase.collection('PubAz').where("owner","==", owner).sort('timestamp', 'desc')
  const { data: azData } = useCollection<Az>(azQuery)

  // UI vars  
  const { setSearchParams, setQz } = rootContext
  const userName = profileData?.data.name ? 
    profileData.data.name : 
    profileData?.data.email ?
      profileData.data.email :
      profileData?.data.id.slice(0,6)  // !fix add to User table
  const createdAt = new Date(profileData?.data.createdAt).toDateString()
  const tabsData = [
    {id: 'pins', data: pins},
    {id: 'qz', data: qzData},
    {id: 'az', data:  azData},
    {id: 'followers', data:  followers}
  ]

  useEffect(() => {
    if (userId) {
      checkFollowing(profileId as string, userId)
      .then(f => {
        setFollowing(f)
      })
    } else {
      setFollowing(false)
    }
  },[userId])


  return ( profileData && (
    <Box
      display={['block']}
      flexDir={'column'}
      overflowY={ 'scroll'}
      className="page"
      pos={'relative'}
      // h={'100%'}
      pt={8}
      px={[0,8]}
      mt={'80px'}
    >
      {profileId != userId && (
        <Button
          pos={'absolute'}
          color={buttonColor}
          bg={following ? 'none' : buttonBgColor}
          border={following ? '1px solid #222' : 'none'}
          borderRadius={20}
          right={[4,'14vw']}
          top={[3,14]}
          py={0}
          lineHeight={1}
          h={[6,8]}
          fontSize={'sm'}
        >
          { following ? "Following" : "Follow" }
        </Button>
      )}
      <Flex
        flexDir={'row'}
        minW={[0, '200px', '250px']}
        className="header"
        px={4}
        alignItems={'center'}
        display={['flex','flex', 'flex', 'inline-block']}
        float={'left'}
        mb={4}
      >
        <Avatar 
          h={['50px', '100px']}
          w={['50px', '100px']}
          mr={2}
        />
        <Stack
          flexDir={'column'}
          alignItems={'left'}
          gap={0}
          flexGrow={1}
        >
          <Text
            fontWeight={'extrabold'}
            fontSize={18}
            noOfLines={2}
            // my={2}
          >
            {userName}
          </Text>
          <Text
            fontSize={12}
          >
            joined {createdAt}
          </Text>
          {/* <Stack
            direction={['row', 'column']}
            lineHeight={'20px'}
            // justifyContent={'space-between'}
            fontSize={12}
            gap={[6,0]}
          >
            <Text>{} pins</Text>
            <Text>{qzData?.data.length || 0} qz</Text>
            <Text>{azData?.data.length || 0} az</Text>
            <Text>{numFollowers} followers</Text>
          </Stack> */}
        </Stack>
      </Flex>

      <Tabs
        isLazy
        lazyBehavior={'keepMounted'}
        variant={'unstyled'}
        display={'flex'}
        flexDir={'column'}
        id="SwipeController"
        overflowX={'hidden'}
        overflowY={'clip'}
        p={0}
        mt={[0,6]}
        w={wArray}
        pos={'relative'}
      >
        <TabList>
          {tabsData.map((e, i) => (
            <Tab
              key={i}
              fontFamily={'Poppins, sans-serif'}
              fontSize={['lg','xl']}
              fontWeight={[400, 500]}
              _selected={{ color: '#008CC9' }}
              alignItems={'baseline'}
            >
              {e.id}
              <Text 
                fontSize={'sm'}
                ml={2}
                // lineHeight={3}
              >
                {e.data?.data.length || 0}
              </Text>
              </Tab>
          ))}
        </TabList>
        <TabPanels
          overflowY={'scroll'}
          h={'100%'}
        >
          <TabPanel
            h={'100%'}
            pb={'20vh'}
          >
            { pins?.data.length ? (
              <List>
                { pins?.data.map((res: any, i: number) => {
                  const params = { q: res.data.id }
                  const onClick = () => {
                    setSearchParams(params)
                    setQz(qzData?.data as CollectionRecordResponse<Qz, Qz>[])
                  }
                  
                  return (
                    <ListItem key={i}>
                      <QCardSmall borderColor={borderColor} onClick={onClick} q={res.data} />
                    </ListItem>
                  )
                })}
              </List>
            ) : (
              <Flex
                minH={100}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Text>No pins yet</Text>
              </Flex>
            )}
          </TabPanel>
          <TabPanel
            pb={'20vh'}
          >
            { qzData?.data.length ? (
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
            ) : (
              <Flex
                minH={100}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Text>No qz yet</Text>
              </Flex>
            )}
          </TabPanel>
          <TabPanel
            pb={'20vh'}
          >
            { azData?.data.length ? (
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
            ) : (
              <Flex
                minH={100}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Text>No pins yet</Text>
              </Flex>
            )}
          </TabPanel>
          <TabPanel
            pb={'20vh'}
          >
            { followers?.data.length ? (
              <List>
                { followers?.data.map((res: any, i: number) => {
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
            ) : (
              <Flex
                minH={100}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Text>No followers yet</Text>
              </Flex>
            )}
          </TabPanel>
        </TabPanels>

      </Tabs>
    </Box>
  ))
}