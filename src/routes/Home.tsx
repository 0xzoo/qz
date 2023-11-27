import { 
  Box
} from '@chakra-ui/react'
import { usePolybase, useCollection } from '@polybase/react'
import { QzTabs } from '../components/qzTabs';
import { CreateQModal } from '../components/createQ';
import { Outlet } from 'react-router-dom';
import { Qz } from '../types/types';
import { CollectionRecordResponse, Query } from '@polybase/client';

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
      data: data?.data as CollectionRecordResponse<Qz, Qz>[],
      query: query
    },
    {
      id: 1,
      name: 'Popular',
      tag: 'Pop',
      loading: popLoading,
      data: popData?.data as CollectionRecordResponse<Qz, Qz>[],
      query: popQuery
    }
  ]

  return (
    <Box
      display={['flex','block']}
      w={'100vw'}
      justifyContent={'space-between'}
      px={[0, '6vw']}
      overflowY={['hidden','scroll']}
      mt={'80px'}
      >
      {!loading && <QzTabs categories={QzCategories} />}
      
      <Box 
        pos={'absolute'}
        bottom={[0,4]}
        right={[0, '6vw']}
        p={[4,2]}
      >
        <CreateQModal />
      </Box>
      <Outlet />
    </Box>
  )
}
