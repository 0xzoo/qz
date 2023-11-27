import {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef
} from "react"
// import { polybase } from "../App"
import {
  // usePolybase,
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
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  ChevronLeftIcon
} from '@chakra-ui/icons'
import { 
  Az as AType,
  Qz as QType,
  Audiences
  // User
} from "../types/types"
import { useWallet } from "../auth/useWallet"
import { RootContext } from "./Root"
import { QA } from '../components/qA'
import { CollectionRecordResponse } from "@polybase/client"
import {
  getUser,
  getQ,
  getPriorAz,
  createNewA,
  markAEdited,
  incrPubAz,
  getNewQz
} from "../pb/functions"

// controller for QAz
// manage queue
// createA
export const Qz = () => {
  const { state } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { 
    // publicKey,
    login,
    loggedInWWallet
  } = useWallet()

  // Root context vars
  const rootContext = useContext(RootContext)
  // const [ searchParams, setSearchParams ] = useSearchParams()
  const {
    qz, // set qsets here, read to currentqueue
    setQz,
    queueIndex,
    setQueueIndex,
    searchParams,
    setSearchParams,
    setLoading
  } = rootContext
  const qId = searchParams?.get('q') as string

  // Q + A vars
  const firstQ = qz.length ? qz[0] : undefined
  console.log('firstQ', firstQ?.data.id)
  const [ currentQ, setCurrentQ ] = useState<CollectionRecordResponse<QType> | undefined >(firstQ)
  const [ currentQueue, setCurrentQueue ] = useState<CollectionRecordResponse<QType, QType>[]>([])
  const [ currentQueueIndex, setCurrentQueueIndex ] = useState<number>(0)
  const [ userAz, setUserAz ] = useState<CollectionRecordResponse<AType, AType>[]>([])

  // createA vars
  const [ qIndex, setQIndex ] = useState<number>()
  const [ value, setValue ] = useState<string>('')
  const [ audience, setAudience ] = useState<string>(Audiences.PUBLIC)
  const [ importance, setImportance ] = useState<number>()
  // const [ asset, setAsset ] = useState<string>()
  const [ response, setResponse ] = useState<string>('')

  const [ qzWidth, setQzWidth ] = useState<number | undefined>()
  console.log('QzRe')

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
    console.log('opening')
    // if q is chosen from a qset, set it as first in array and use qset as qzSet
    if (firstQ) {
      // setQz([firstQ, ...qz.splice(queueIndex, 1)])
      setCurrentQueue([firstQ])
    // else, get q using qId and populate array with new qz for now, vector based later
    } else {
      getQ(qId)
        .then(q => {
          setCurrentQ(q)

          getNewQz()
            .then(res => {
              // should check if q is in array, and remove(?)
              setQz([q, ...res])
              setCurrentQueue([q])
            })
        })      
    } 

    getPriorAz(qId, state?.userId as string)
      .then(az => {
        if (az.length) {
          setUserAz(az)
          const newestA = az[0].data
          switch (currentQ?.data.type) {
            case 'mc':
              const newestAQIndex = newestA.qIndex
              setQIndex(newestAQIndex)
              break
            case 'text':
              const newestAValue = newestA.value as string
              setValue(newestAValue)
              break
            case 'scale':
              const newestAScaleValue = newestA.value as string
              setValue(newestAScaleValue)
              break
          }
        }
      })
  },[])

  // should prob do this in qA
  useEffect(() => {
    console.log('currentQ', currentQ?.data.id)
    getPriorAz(currentQ?.data.id as string, state?.userId as string)
      .then(az => {
        if (az.length) {
          setUserAz(az)
          const newestA = az[0].data
          switch (currentQ?.data.type) {
            case 'mc':
              const newestAQIndex = newestA.qIndex
              setValue('')
              setQIndex(newestAQIndex)
              break
            case 'text':
              const newestAValue = newestA.value as string
              setValue(newestAValue)
              setQIndex(undefined)
              break
            case 'scale':
              const newestAScaleValue = newestA.value as string
              console.log('newestAScaleValue', newestAScaleValue)
              setValue(newestAScaleValue)
              setQIndex(undefined)
              break
          }
        } else {
          setValue('') // !fix change to undefined
          setQIndex(undefined)
        }
      })
  },[currentQ])

  const onCloseQz = () => {
    setQueueIndex(currentQueueIndex)
    onClose()
    setTimeout(() => {setSearchParams({})}, 200)
  }

  const getNextQ = () => {
    // get next qId and set to params
    let nextQ = qz[currentQueueIndex + 1]
    // if (nextQ.data.id == firstQ?.data.id) {
    //   console.log('skipping q', nextQ.data.id)
    //   const newQz = qz
    //   newQz.splice(currentQueueIndex, 1)
    //   setQz(newQz)
    //   nextQ = newQz[currentQueueIndex + 2]
    // }
    console.log('nextQId', nextQ.data.id)
    const params = { q: nextQ.data.id }
    const newQueue = [...currentQueue, qz[currentQueueIndex + 1]]
    setCurrentQueueIndex(currentQueueIndex + 1)
    setCurrentQueue(newQueue)
    setQueueIndex(queueIndex + 1)
    setSearchParams(params)
    setCurrentQ(nextQ)
    console.log('newQueue', newQueue)
  }

  const onSkipQ = () => {
    // change index in currentQueue
    getNextQ()
    // navigate to next in queue
  }

  // !fix
  const handleLogin = () => {
    login()
  }

  const onSubmitA = async () => {
    if (!currentQ?.id) return // !fix

    const anon = false // !fix add anon
    const userId = state?.userId as string
    // let user
    // getUser(userId)
    //   .then(res => user = res)
    const valueOr = value === "" ? undefined : value
    const timestamp = Date.now()

    // if (audience == 'Only Me') { // !fix make enum
      // console.log(publicKey)
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
      // const allowList = [user]
      // const newPrivA: any = [
      //   nanoid(),
      //   user,
      //   q,
      //   timestamp,
      //   allowList,
      //   qIndex,
      //   valueOr,
      //   importance
      // ]
      // await polybase.collection('PrivAz').create(newPrivA).catch((e) => {throw e})
      // await polybase.collection('Qz').record(currentQ.id).call("incrPrivAz", [currentQ.id]).catch((e) => {throw e})
    // } else {
      // const newPubA: any = [
      //   nanoid(),
      //   currentQ,
      //   timestamp,
      //   anon,
      //   user,
      //   qIndex,
      //   valueOr,
      //   importance
      // ]
      // console.log(newPubA)

      // await polybase.collection('PubAz').create(newPubA).catch((e) => {throw e})

      // for if/when we add assets
      const asset = undefined
      const formattedQ = {
        collectionId : currentQ.id,
        id: currentQ.data.id
      }

      getUser(userId)
        .then((user) => {
          let newPubA: any = [
            nanoid(),
            formattedQ,
            timestamp,
            anon,
            user,
            qIndex,
            valueOr,
            importance,
            asset
          ]
          console.log(newPubA)
          createNewA(newPubA, audience) // !fix add allowlist
          .then(() => {
            // edits dont increment answer numbers
            if (userAz?.length) {
              const newestA = userAz[0].data
              // !fix what if user is switching audience?
              markAEdited(newestA.id, audience).catch((e) => {setLoading(false); throw e})
            } else {
              // !fix use incrAz when you figure out private posts
              incrPubAz(qId).catch((e) => {setLoading(false); throw e})
            }
          })
        })
    // }
    // update az
    setLoading(false) // !fix switch to translate animation
    // nextQ()
  }

  const handleMcRadio = useCallback((i: string) => {
    if (currentQ && currentQ.data.az) {
      const qIndex = currentQ.data.az.indexOf(i)
      setQIndex(qIndex)
      const qIndexString = String(qIndex)
      setResponse(qIndexString)
    }
  },[currentQ])
  
  const handleAudience = (s: string) => {
    setAudience(s)
  }
  
  const handleImportance = (i: number) => {
    setImportance(i)
  }
  
  const handleValue = (s: string) => {
    setValue(s)
    setResponse(s)
  }

  const initialRef = useRef(null)

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
      {/* <Form> */}
        <DrawerContent pt={20} bgColor={useColorModeValue('#ff0', 'gray.700')}>
          <Button
            aria-label='Back to Qz'
            onClick={onCloseQz}
            bg={'transparent'}
            w={'fit-content'}
            variant={'link'}
            fontWeight={'normal'}
            color={useColorModeValue('gray.700', 'gray.200')}
            ml={4}
            mt={2}
            pr={2}
          >
            <ChevronLeftIcon boxSize={10} /> Back to Qz
          </Button>
          <DrawerBody>
            <Flex
              w={'100%'}
              h={'100%'}
              flexDir={'row'}
              overflowX={'scroll'}
              position={'relative'}
            >
              <Flex
                w={'100%'}
                ref={(node) => setQzWidth(node?.offsetWidth)}
                // transform={'translateX(-100px)'}
                transform={'translateX(-' + (qzWidth ? currentQueueIndex * qzWidth : 0).toString() + 'px)'}
                transition={'all 333ms'}
              >
                { currentQueue?.map((q) => {
                  const QAProps = {
                    qIndex,
                    handleMcRadio,
                    audience,
                    handleAudience,
                    handleImportance,
                    value,
                    handleValue,
                    initialRef,
                    currentQ: q.data,
                    userAz
                  }

                  return (
                    <QA {...QAProps} />
                  )
                })}
              </Flex>
            </Flex>
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
                          colorScheme='linkedin'
                          onClick={onSubmitA}
                          isDisabled={response === '' ? true : false}
                        >
                          Edit
                        </Button>
                    ) : (
                      <Button
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
      {/* </Form> */}
    </Drawer>
  )
}
