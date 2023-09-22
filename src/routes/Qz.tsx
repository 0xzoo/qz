import React, {
  useEffect,
  useState,
  useCallback,
  useContext
} from "react"
import {
  Form,
  // useParams,
  // useSearchParams
} from 'react-router-dom'
import { polybase } from "../App"
import {
  usePolybase,
  useAuth,
  // useDocument,
  // useCollection
} from "@polybase/react"
// import { listAzToQ } from "../pb/functions"
// import { secp256k1, decodeFromString } from "@polybase/util"
import { nanoid } from 'nanoid'
import {
  Button,
  Flex,
  Drawer,
  DrawerBody,
  DrawerFooter,
  // DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  // DrawerCloseButton,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  ChevronLeftIcon
} from '@chakra-ui/icons'
import { 
  Az as AType, 
  Qz as QType
} from "../types/types"
import { useWallet } from "../auth/useWallet"
import { RootContext } from "./Root"
import { QA } from '../components/qA'
import { CollectionList, CollectionRecordResponse } from "@polybase/client"
// import { CollectionList } from "@polybase/client"


async function getQ (qId: string) {
  const record: CollectionRecordResponse<QType, QType> = await polybase.collection("Qz").record(qId).get()
  const { data: currentQData } = record

  return currentQData
}

async function getQueue (qz?: CollectionRecordResponse<QType, QType>[]) {
  let queueData
  if (qz) {
    queueData = qz
  } else {
    const records: CollectionList<QType> = await polybase.collection("Qz").sort('timestamp', 'desc').get()
    const { data: currentQueueData } = records
    queueData = currentQueueData
  }

  return queueData
}

async function getPriorAz (qId: string, user?: string) {
  if (user) {
    const records: CollectionList<AType> = await polybase.collection("PubAz")
      .where('qId', '==', polybase.collection("Qz").record(qId))
      .where('owner', '==', polybase.collection("User").record(user))
      .sort('timestamp', 'desc')
      .get()
    const { data: priorAzData } = records

    return priorAzData
  } else {
    return []
  }
}


export const Qz = () => {
  const polybase = usePolybase()
  const { state } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { publicKey, login, loggedInWWallet } = useWallet()

  const rootContext = useContext(RootContext)
  const qId = rootContext.searchParams?.get('q')
  const {
    setSearchParams,
    qz,
    // setQz
  } = rootContext
  const [ currentQ, setCurrentQ ] = useState<QType>()
  const [ currentQueue, setCurrentQueue ] = useState<CollectionRecordResponse<QType, QType>[] | undefined>([])
  const [ currentQueueIndex, setCurrentQueueIndex ] = useState<number>(0)
  const [ userAz, setUserAz ] = useState<CollectionRecordResponse<AType, AType>[]>()

  const [ qIndex, setQIndex ] = useState<number>()
  const [ value, setValue ] = useState<string>("")
  const [ isPrivateA, setIsPrivateA ] = useState<boolean>(false)
  const [ importance, setImportance ] = useState<number>()
  // const [ asset, setAsset ] = useState<string>()
  const [ response, setResponse ] = useState<string>("")


  // const { data: qData, loading: qLoading } = useDocument(polybase.collection('Qz').record(qId as string))
  // const currentQData = await polybase.collection("Qz")
  // .record(qId as string)
  // .get()



  
  // create currentQSet starting with current qId length 5

  // Query for Qs
  // const qzCollectionReference = polybase.collection("Qz")
  // const azCollectionReference = polybase.collection("Az")
  // const query = polybase.collection('Qz').sort('timestamp', 'desc')

  // check against qz already answered by user

  // Query for prior answers to this question by this user
  // const { data: priorAz } = useCollection(
  //   qId
  //     ? azCollectionReference
  //       .where('qId', '==', qzCollectionReference.record(qId))
  //     : null
  // )


  useEffect(() => {
    onOpen()

    getQ(qId as string)
      .then(q => {
        setCurrentQ(q)

        getPriorAz(qId as string, state?.userId as string)
          .then(az => {
            if (az.length) {
              setUserAz(az)
              const newestA = az[0].data
              switch (q.type) {
                case 'mc':
                  const newestAQIndex = newestA.qIndex
                  setQIndex(newestAQIndex)
                  break
                case 'shortText':
                  const newestAShortValue = newestA.value as string
                  setValue(newestAShortValue)
                  break
                case 'longText':
                  const newestALongValue = newestA.value as string
                  setValue(newestALongValue)
                  break
              }
            }
          })
      })
    getQueue(qz)
      .then(res => {
        setCurrentQueue(res)
      })
    
  },[])

  // useEffect(() => {
  //   setCurrentQ(currentQData)
  // },[currentQData])

  // useEffect(() => {
  //   if (!qz) {

  //     // setQz(data.data)
  //   }
  //   setCurrentQueue(qz)
  // },[qz])



  const onCloseQz = () => {
    onClose()
    setSearchParams({})
  }

  const nextQz = () => {
    // get next qId and set to params
    const nextQId = currentQueue && currentQueue[currentQueueIndex + 1].id
    console.log(nextQId)
    const params = nextQId && { q: nextQId }
    setCurrentQueueIndex(currentQueueIndex + 1)
    setSearchParams(params)

    // add new qA to qzArray
  }

  const onSkipQ = () => {
    // change index in currentQueue
    nextQz()
    // navigate to next in queue
  }

  const handleLogin = () => {
    login()
  }

  const onSubmitA = async () => {
    if (!currentQ) return

    // if priorA, markAEdited priorAz[0], create new PubA, dont incrPubAz
    
    const user = publicKey && await polybase.collection('User').record(state?.userId as string).get().catch((e) => console.log('error getting user from db', e))
    const q = await polybase.collection('Qz').record(currentQ.id as string).get().catch((e) => {throw e})
    const valueOr = value === "" ? undefined : value
    const timestamp = Date.now()

    const newA: any = [
      nanoid(),
      user,
      q,
      timestamp,
      qIndex,
      valueOr,
      importance
    ]

    if (isPrivateA) {
    //   // encrypt asymm
    //   // const publicKey = wallet.publicKey as string
    //   console.log(publicKey)
    //   const pkUintArray = decodeFromString(publicKey as string, 'hex')
    //   console.log(pkUintArray)
    //   console.log(typeof qIndex)
        
    //   // const strDataToBeEncrypted = decodeFromString(response as string, 'utf8')
    //   if (response) {console.log('ye ok')}
    //   const encryptedValueAsHexStr = await secp256k1.asymmetricEncryptToEncoding(
    //     pkUintArray,
    //     response as string
    //   );

    //   console.log('encryptedValueAsHexStr', encryptedValueAsHexStr)
    } 

    console.log('newA', newA)
    await polybase.collection('PubAz').create(newA).catch((e) => {throw e})
    await polybase.collection('Qz').record(currentQ.id).call("incrPubAz", [currentQ.id]).catch((e) => {throw e})
  }

  const handleMcRadio = useCallback((i: string) => {
    if (currentQ && currentQ.az) {
      const qIndex = currentQ.az.indexOf(i)
      setQIndex(qIndex)
      const qIndexString = String(qIndex)
      setResponse(qIndexString)
    }
  },[currentQ])
  
  const handleIsPrivate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivateA(e.target.checked)
  },[])
  
  const handleImportance = useCallback((i: number) => {
    setImportance(i)
  },[])
  
  const handleValue = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    setResponse(e.target.value)
  },[])

  const initialRef = React.useRef(null)  

  const QAProps = {
    qIndex,
    handleMcRadio,
    handleIsPrivate,
    handleImportance,
    value,
    handleValue,
    initialRef,
    currentQ: currentQ as QType,
    userAz
  }

  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={onCloseQz}
      // onCloseComplete={() => navigate('/')}
      size={'full'}
      blockScrollOnMount={false}
      initialFocusRef={initialRef}
    >
      <DrawerOverlay />
      <Form>
        <DrawerContent pt={20} bgColor={useColorModeValue('#ff0', 'gray.700')}>
          <Button
            aria-label='Back to Qz'
            onClick={onCloseQz}
            bg={'transparent'}
            w={'fit-content'}
            variant={'link'} ml={4}
            fontWeight={'normal'}
            color={useColorModeValue('gray.700', 'gray.200')}
          >
            <ChevronLeftIcon boxSize={10} /> Back to Qz
          </Button>
          <DrawerBody>
            {/* { currentQueue?.map(())} */}
            <QA {...QAProps} />
          </DrawerBody>
          <DrawerFooter>
            <Flex direction={'row'} justifyContent={'space-between'} w={'100%'}>
              <Button variant='outline' mr={3} onClick={onSkipQ}>
                Skip
              </Button>
              {/* !fix users should be able to skip even if theyve responded */}
              { loggedInWWallet 
                  ? userAz?.length
                    ? (
                        <Button
                          // type='submit'
                          colorScheme='linkedin'
                          onClick={onSubmitA}
                          isDisabled={response === '' ? true : false}
                        >
                          Edit
                        </Button>
                    ) : (
                      <Button
                        // type='submit'
                        colorScheme='linkedin'
                        onClick={onSubmitA}
                        isDisabled={response === '' ? true : false}
                      >
                        Save
                      </Button>
                    )
                  : response === '' ? (
                    <Button colorScheme='linkedin' onClick={login}>
                      Login
                    </Button>
                  ):(
                    <Button colorScheme='linkedin' onClick={handleLogin}>
                      Login to save
                    </Button>
              )}
            </Flex>
          </DrawerFooter>
          {/* <DrawerCloseButton top={20} size={'lg'}/> */}
          {/* <ArrowNavs /> */}
        </DrawerContent>
      </Form>
    </Drawer>
  )
}
