import {
  useMemo,
  createContext, 
  useState,
} from 'react'
import { 
  Flex,
} from '@chakra-ui/react'
import { Outlet, SetURLSearchParams, useSearchParams } from "react-router-dom"
import { NavBar } from "../components/navbar"
import { LoadingSpinner } from '../components/loadingSpinner'
import { Qz } from './Qz'
import { Qz as qType } from '../types/types'
import { CollectionRecordResponse } from '@polybase/client'


export interface RootContextValue {
  qz: CollectionRecordResponse<qType, qType>[]
  setQz: React.Dispatch<React.SetStateAction<CollectionRecordResponse<qType, qType>[]>>
  queueIndex: number
  setQueueIndex: React.Dispatch<React.SetStateAction<number>>
  searchParams: URLSearchParams | undefined
  setSearchParams: SetURLSearchParams
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const RootContext = createContext<RootContextValue>({
  qz: [],
  setQz: () => {},
  queueIndex: 0,
  setQueueIndex: () => {},
  searchParams: undefined,
  setSearchParams: () => {},
  setLoading: () => {}
})

export default function Root() {
  console.log('rootreload')

  const [ qz, setQz ] = useState<CollectionRecordResponse<qType, qType>[]>([])
  const [ queueIndex, setQueueIndex ] = useState<number>(0)
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ searchParams, setSearchParams ] = useSearchParams()
  
  const hasQ = searchParams.get('q')

  const value = useMemo(() => ({
    qz,
    setQz,
    queueIndex,
    setQueueIndex,
    searchParams,
    setSearchParams,
    setLoading
  }), [qz, searchParams])

  return (
    <RootContext.Provider value={value}>
      <Flex direction={'column'} h='100vh'>
        <NavBar />
        {loading && <LoadingSpinner />}
        <Outlet />
        {hasQ && <Qz />}
      </Flex>
    </RootContext.Provider>
  )
}
