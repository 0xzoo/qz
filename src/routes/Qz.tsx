import React, {
  useEffect,
  useState,
  useCallback
} from "react"
import {
  useNavigate,
  Form,
  useParams,
  // useSearchParams
} from 'react-router-dom'
import {
  usePolybase,
  useAuth,
  useDocument,
  useCollection
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
  // Az as AType, 
  Qz as QType
} from "../types/types"
import { useWallet } from "../auth/useWallet"
import { QA } from '../components/qA'
// import { CollectionList } from "@polybase/client"



export const Qz = () => {
  const polybase = usePolybase()
  const navigate = useNavigate()
  const { state } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const [ currentQSet, setCurrentQSet ] = useState()
  const { qId } = useParams()
  const [ currentQ, setCurrentQ ] = useState<QType>()
  // const [ userAz, setUserAz ] = useState<AType[] | null>(null)
  const [ qIndex, setQIndex ] = useState<number>()
  const [ value, setValue ] = useState<string>("")
  const [ isPrivateA, setIsPrivateA ] = useState<boolean>(false)
  const [ importance, setImportance ] = useState<number>()
  // const [ asset, setAsset ] = useState<string>()
  const [ response, setResponse ] = useState<string>("")
  const { publicKey, login, loggedInWWallet } = useWallet()

  const { data: qzData } = useCollection(polybase.collection('Qz').sort('timestamp', 'asc'))
  console.log('qzData', qzData)
  const { data: qData, loading: qLoading } = useDocument(polybase.collection('Qz').record(qId as string))
  console.log('qData',qData)

  // const data = useLoaderData() as any
  // console.log(data)
  // create currentQSet starting with current qId length 5

  // Query for Qs
  // const qzCollectionReference = polybase.collection("Qz")
  // const azCollectionReference = polybase.collection("Az")
  // const query = polybase.collection('Qz').sort('timestamp', 'desc')

  // check against qz already answered by user
  // const qId = data.data.id
  // console.log(qId)

  // Query for prior answers to this question by this user
  // const { data: priorAz } = useCollection(
  //   currentQ
  //     ? azCollectionReference
  //       .where('qId', '==', qzCollectionReference.record(currentQ.id))
  //     : null
  // )

  // console.log(priorAz)

  // setUserAz(priorAz?.data as unknown as AType[]) 
  
  // const { data: priorAz } = useCollection(
  //   qId
  //     ? azCollectionReference
  //       .where('qId', '==', qzCollectionReference.record(qId))
  //     : null
  // )

  // console.log(priorAz)

  useEffect(() => {
    console.log('opening')
    onOpen()
  },[])

  useEffect(() => {
    console.log('qLoading', qLoading)
    setCurrentQ(qData?.data)
  },[qLoading])

  // useEffect(() => {
  //   console.log(navigation.state)
  //   if (navigation.state === "loading" && !isOpen) navigate("/")
  // },[isOpen])

  const onCloseQz = () => {
    onClose()
  }

  const onSkipQ = () => {
    
  }

  const handleLogin = () => {
    login()
  }

  const onSubmitA = async () => {
    console.log(loggedInWWallet)
    if (!currentQ) return
    
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
    console.log(i)
  },[])
  
  const handleValue = useCallback((s: string) => {
    setValue(s)
    setResponse(s)
  },[])

  const initialRef = React.useRef(null)  

  const QzContextProps = {
    handleMcRadio,
    handleIsPrivate,
    handleImportance,
    handleValue,
    initialRef,
    currentQ: currentQ as QType
  }

  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={onCloseQz}
      onCloseComplete={() => navigate('/')}
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
            { currentQ && <QA {...QzContextProps} /> }
          </DrawerBody>
          <DrawerFooter>
            <Flex direction={'row'} justifyContent={'space-between'} w={'100%'}>
              <Button variant='outline' mr={3} onClick={onSkipQ}>
                Skip
              </Button>
              {/* !fix users should be able to skip even if theyve responded */}
              { loggedInWWallet ? (
                <Button
                  type='submit'
                  colorScheme='blue'
                  onClick={onSubmitA}
                  isDisabled={response === '' ? true : false}
                >
                  Save
                </Button>
              ) : response === '' ? (
                <Button colorScheme='blue' onClick={login}>
                  Login
                </Button>
              ):(
                <Button colorScheme='blue' onClick={handleLogin}>
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
