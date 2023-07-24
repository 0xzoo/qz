import React, { useEffect, useState, useContext, useCallback } from "react"
import { useNavigate, useLoaderData } from 'react-router-dom'
import {
  usePolybase,
  useAuth,
  // useCollection
} from "@polybase/react"
// import { listAzToQ } from "../pb/functions"
import { secp256k1, decodeFromString } from "@polybase/util"
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
  DrawerCloseButton,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react'
import { 
  // Az as AType, 
  Qz as QType
} from "../types/types"
// import { getPublicKey } from "../auth/useLogin"
import { WalletContext } from "../auth/WalletProvider"
import { QA } from "../components/qA"
// import { CollectionList } from "@polybase/client"
// import { useWallet } from "../auth/useWallet"


export const Qz = () => {
  const polybase = usePolybase()
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const [ currentQSet, setCurrentQSet ] = useState()
  const [ currentQ, setCurrentQ ] = useState<QType>()
  // const [ userAz, setUserAz ] = useState<AType[] | null>(null)
  const [ qIndex, setQIndex ] = useState<string>()
  const [ value, setValue ] = useState<string>("")
  const [ isPrivateA, setIsPrivateA ] = useState<boolean>(false)
  const [ importance, setImportance ] = useState<number>()
  // const [ asset, setAsset ] = useState<string>()
  const [ response, setResponse ] = useState<string>("")
  const authState = useAuth().state;
  const wallet = useContext(WalletContext)
  // const { skipSigning, reinforceSigning } = useWallet()
  console.log('Qz reloaded')

  // const { data: qData, error, loading } = useDocument(
  //   qId ? polybase.collection('Qz').record(qId) : null,
  // )

  const data = useLoaderData() as any
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
    onOpen()

    const qData= data.data as QType
    setCurrentQ(qData)
  },[])

  const onCloseQz = () => {
    onClose()
    navigate("/")
  }

  const onSubmitA = async () => {
    switch (data.type) {
      case value:
        
        break;
    
      default:
        break;
    }
    
    const publicKey = authState?.userId as string
    const user = await polybase.collection('User').record(publicKey).get()
    const valueOr = value === "" ? undefined : value
    const timestamp = Date.now()

    const newA: any = [
      nanoid(),
      user,
      data,
      timestamp,
      isPrivateA,
      qIndex,
      valueOr,
      importance,
      // asset
    ]

    if (isPrivateA) {
      // encrypt asymm
      const publicKey = wallet.publicKey as string
      console.log(publicKey)
      const pkUintArray = decodeFromString(publicKey, 'hex')
      console.log(pkUintArray)
      console.log(typeof qIndex)
        
      // const strDataToBeEncrypted = decodeFromString(response as string, 'utf8')
      if (response) {console.log('ye ok')}
      const encryptedValueAsHexStr = await secp256k1.asymmetricEncryptToEncoding(
        pkUintArray,
        response as string
      );

      console.log('encryptedValueAsHexStr', encryptedValueAsHexStr)
    } 
    // if (typeof qIndex != null) {
    //   newA.push(qIndex as unknown as number)
    // }
    // !fix
    // if (value !== '') newA.push(value as string)
    // if (typeof importance != null) newA.push(importance as number)

    // const pk = getPublicKey(userId)
    console.log('newA', newA)
    // console.log('pk', pk)
    await polybase.collection('Az').create(newA).catch((e) => console.log('az err', e))
    // skipSigning()
    await polybase.collection('Qz').record(data.id).call("incrNumAz", [data.id]).catch((e) => console.log(e))
    // reinforceSigning()
    // generatePath("/users/:id", { id: "42" });
    // navigate
  }

  const handleMcRadio = useCallback((i: string) => {
    const qIndex = data.data.az.indexOf(i)
    setQIndex(qIndex)
    const qIndexString = String(qIndex)
    setResponse(qIndexString)
  },[setQIndex, setResponse])
  
  const handleIsPrivate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivateA(e.target.checked)
  },[setIsPrivateA])
  
  const handleImportance = useCallback((i: number) => {
    setImportance(i)
    console.log(i)
  },[setImportance])
  
  const handleValue = useCallback((s: string) => {
    setValue(s)
    setResponse(s)
  },[setValue, setResponse])

  const initialRef = React.useRef(null)  

  const QzContextProps = {
    handleMcRadio,
    handleIsPrivate,
    handleImportance,
    handleValue,
    initialRef,
    currentQ 
  }

  return (
    <Drawer
      isOpen={isOpen}
      placement='bottom'
      onClose={onCloseQz}
      size={'full'}
      blockScrollOnMount={false}
      initialFocusRef={initialRef}
    >
      <DrawerOverlay />
      <DrawerContent pt={20} bgColor={useColorModeValue('#ff0', 'gray.700')}>
        {/* {currentQSet && <DrawerHeader>Create your account</DrawerHeader>} */}
        <DrawerBody>
          <QA {...QzContextProps} />
        </DrawerBody>
        <DrawerFooter>
          <Flex direction={'row'} justifyContent={'space-between'} w={'100%'}>
            <Button variant='outline' mr={3} onClick={onCloseQz}>
              Save and Quit
            </Button>
            {/* !fix users should be able to skip even if theyve responded */}
            <Button colorScheme='blue' onClick={onSubmitA}>
              {response === "" ? ('Skip'):('Save and Next')}
            </Button>
          </Flex>
        </DrawerFooter>
        <DrawerCloseButton top={20} size={'lg'}/>
        {/* <ArrowNavs /> */}
      </DrawerContent>
    </Drawer>
  )
}
