import { 
  Flex,
  Box
} from '@chakra-ui/react'
// import { useSwipeable } from 'react-swipeable'
import { usePolybase, useCollection } from '@polybase/react'
import { Outlet } from "react-router-dom"
import { NavBar } from "../components/navbar"
import { CreateQModal } from "../components/createQ"
import { QzTabs } from '../components/qzTabs'

// !fix use suspense
const Home = () => {
  const polybase = usePolybase()

  // Query for Qs
  const query = polybase.collection('Qz').sort('timestamp', 'desc')
  const { data, loading } = useCollection(query)

  const popQuery = polybase.collection('Qz').sort('numAz', 'desc')
  const { data: popData, loading: popLoading } = useCollection(popQuery)

  // !fix change to load data on view load
  let QzCategories = [
    {
      id: 0,
      name: 'New',
      tag: 'New',
      loading: loading,
      data: data
    },
    {
      id: 1,
      name: 'Popular',
      tag: 'Pop',
      loading: popLoading,
      data: popData
    }
  ]

  return (
    <Flex 
      direction={'column'}
      h={'100%'}
      w={'100vw'}
      justifyContent={'space-between'}
      p={0}
      overflow={'hidden'}

    >
      {!loading && <QzTabs categories={QzCategories} />}
      
      <Box 
        pos={'absolute'}
        bottom={0}
        right={0}
        p={4}
      >
        <CreateQModal />
      </Box>
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