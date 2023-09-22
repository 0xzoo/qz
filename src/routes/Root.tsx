import {
  useMemo,
  createContext, 
  useState,
  // useEffect 
} from 'react'
import { 
  Flex,
  // Box
} from '@chakra-ui/react'
// import { useSwipeable } from 'react-swipeable'
// import { usePolybase, useCollection } from '@polybase/react'
import { Outlet, SetURLSearchParams, useSearchParams } from "react-router-dom"
import { NavBar } from "../components/navbar"
// import { CreateQModal } from "../components/createQ"
// import { QzTabs } from '../components/qzTabs'
import { Qz } from './Qz'
import { Qz as qType } from '../types/types'
import { CollectionRecordResponse } from '@polybase/client'
// import { usePolybase } from '@polybase/react'



export interface RootContextValue {
  qz: CollectionRecordResponse<qType, qType>[] | undefined
  setQz: React.Dispatch<React.SetStateAction<CollectionRecordResponse<qType, qType>[] | undefined>>
  searchParams: URLSearchParams | undefined
  setSearchParams: SetURLSearchParams
}

export const RootContext = createContext<RootContextValue>({
  qz: undefined,
  setQz: () => {},
  searchParams: undefined, // qId -> Qz
  setSearchParams: () => {}
})

export default function Root() {
  console.log('wholerootreload')

  const [ qz, setQz ] = useState<CollectionRecordResponse<qType, qType>[]>()
  const [ searchParams, setSearchParams ] = useSearchParams()
  
  const hasQ = searchParams.get('q')
  console.log(hasQ)

  const value = useMemo(() => ({
    qz,
    setQz,
    searchParams,
    setSearchParams
  }), [qz, searchParams])

  return (
    <RootContext.Provider value={value}>
      <Flex direction={'column'} h='100vh'>
        <NavBar />
        <Outlet />
        {hasQ && <Qz />}
      </Flex>
    </RootContext.Provider>
  )
}
