import { 
  Box
} from '@chakra-ui/react'
import { usePolybase, useCollection } from '@polybase/react'
// import { Link as RouterLink, generatePath } from "react-router-dom";
import { QzTabs } from '../components/qzTabs';
import { CreateQModal } from '../components/createQ';
import { Outlet } from 'react-router-dom';
import { Qz } from '../types/types';
import { Query } from '@polybase/client';
// import { useCallback, useEffect } from 'react';

export const Home = () => {
  const polybase = usePolybase()

  // Query for Qs
  const query: Query<Qz> = polybase.collection('Qz').sort('timestamp', 'desc')
  const { data, loading } = useCollection<Qz>(query)

  const popQuery: Query<Qz>  = polybase.collection('Qz').sort('pubAz', 'desc')
  const { data: popData, loading: popLoading } = useCollection<Qz>(popQuery)


  // !fix change to load data on view load
  const QzCategories = [
    {
      id: 0,
      name: 'New',
      tag: 'New',
      loading: loading,
      data: data,
      query: query
    },
    {
      id: 1,
      name: 'Popular',
      tag: 'Pop',
      loading: popLoading,
      data: popData,
      query: popQuery
    }
  ]

  return (
    <Box 
      // direction={'column'}
      // h={'100vh'}
      display={['flex','block']}
      w={'100vw'}
      justifyContent={'space-between'}
      p={0}
      overflowY={['hidden','scroll']}

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
      <Outlet />
    </Box>
  )
}
