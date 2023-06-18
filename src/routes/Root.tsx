import { Outlet } from "react-router-dom"
import { NavBar } from '../components/navbar'
import { 
  Flex,
  Heading,
  Link,
  List,
  Text,
  Stack,
  Spinner
} from '@chakra-ui/react'
import { usePolybase, useCollection } from '@polybase/react'
import { Link as RouterLink, generatePath } from "react-router-dom"
import { CreateQModal } from '../components/createQ'

const Home = () => {
  const polybase = usePolybase()

  // Query for Qs
  const query = polybase.collection('Qz').sort('timestamp', 'desc')
  const { data, loading } = useCollection(query)

  const popQuery = polybase.collection('Qz').sort('numAz', 'desc')
  const { data: popData, loading: popLoading } = useCollection(popQuery)

  const NewQz = () => {
    return (
      <List>
        {data?.data.map((res: any, i: number) => {
          const path = generatePath("/q/:qId", { qId: res.data.id });
          return (
            <Link as={RouterLink} to={path} key={i}>
              <Flex direction={'row'} border='1px solid' borderColor='gray.100' p={4} justifyContent={'space-between'}>
                <Text fontSize='lg'>{res.data.stem}</Text>
                <Text>{res.data.numAz}</Text>
              </Flex>
            </Link>
          )
        })}
      </List>
    )
  }

  const PopQz = () => {
    return (
      <List>
        {popData?.data.map((res: any, i: number) => {
          const path = generatePath("/q/:qId", { qId: res.data.id });
          return (
            <Link as={RouterLink} to={path} key={i}>
              <Flex direction={'row'} border='1px solid' borderColor='gray.100' p={4} justifyContent={'space-between'}>
                <Text fontSize='lg'>{res.data.stem}</Text>
                <Text>{res.data.numAz}</Text>
              </Flex>
            </Link>
          )
        })}
      </List>
    )
  }

  return (
    <Flex direction={'column'} h={'100%'} w={'100vw'} justifyContent={'space-between'} p={10}>
      <Flex direction={'row'} h={'80%'} w={'100%'} justifyContent={'space-around'}>
        <Stack spacing={8} w='40%' maxW='50em' h='80%'>
          <Heading as={'h2'} fontSize={'2xl'}>New Qz</Heading>
          <Flex direction={'column'} justifyContent={'flex-start'}>
            {loading ? (
              <Spinner />
            ) : (
              <NewQz />
            )}
          </Flex>
        </Stack>
        <Stack spacing={8} w='40%' maxW='50em' h='80%'>
          <Heading as={'h2'} fontSize={'2xl'}>Pop Qz</Heading>
          <Flex direction={'column'} justifyContent={'flex-start'}>
            {popLoading ? (
              <Spinner />
            ) : (
              <PopQz />
            )}
          </Flex>
        </Stack>
      </Flex>
      <Flex w='100%' justifyContent={'center'}>
        <CreateQModal />
      </Flex>
    </Flex>
  )
}

export default function Root() {

  return (
    <Flex direction={'column'} h='100vh'>
      <NavBar />
      <Home />
      <Outlet />
    </Flex>
  )
}