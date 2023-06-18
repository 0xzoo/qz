import { useEffect, useState, useContext, useCallback, useMemo } from "react"
import { generatePath, Outlet, useNavigate, useOutletContext, useParams, useLoaderData } from 'react-router-dom'
import { usePolybase, useDocument } from "@polybase/react"
import { useAuth } from "@polybase/react"
import { secp256k1, decodeFromString } from "@polybase/util"
import { nanoid } from 'nanoid'
import {
  Stack,
  Button,
  Flex,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { Qz as QType, User, Owner, AType, loaderData } from "../types/types"
import { getPublicKey } from "../auth/useLogin"
import { WalletContext } from "../auth/WalletProvider"
import { useWallet } from "../auth/useWallet"


export const Qz = () => {
  const polybase = usePolybase()
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ currentQSet, setCurrentQSet ] = useState()
  const [ currentQ, setCurrentQ ] = useState<QType>()
  const [ qIndex, setQIndex ] = useState<string>()
  const [ value, setValue ] = useState<string>("")
  const [ isPrivateA, setIsPrivateA ] = useState<boolean>(false)
  const [ importance, setImportance ] = useState<number>()
  const [ asset, setAsset ] = useState<string>()
  const [ response, setResponse ] = useState<string>("")
  const authState = useAuth().state;
  const wallet = useContext(WalletContext)
  // const { skipSigning, reinforceSigning } = useWallet()

  // const { data: qData, error, loading } = useDocument(
  //   qId ? polybase.collection('Qz').record(qId) : null,
  // )

  const data = useLoaderData() as any
  // create currentQSet starting with current qId length 5

  // Query for Qs
  // const query = db.collection('Qz').sort('timestamp', 'desc');
  // const { data, error, loading } = useCollection(query);

  // const newQz: any = data?.data;

  // let qzArray = []

  // for (let index = 0; index < newQz.length; index++) {
  //   const q = newQz[index];
    
  // }


  // check against qz already answered by user
  // pass down to child for links

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
    const qId = {
      collectionId: data.collection.id as string,
      id: data.data.id as string
    }
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
      asset
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
    await polybase.collection('Qz').record(qId.id).call("incrNumAz").catch((e) => {throw e})
    // reinforceSigning()
    // generatePath("/users/:id", { id: "42" });
    // navigate
  }


  const handleMcRadio = (i: string) => {
    const qIndex = data.data.az.indexOf(i)
    setQIndex(qIndex)
    const qIndexString = String(qIndex)
    setResponse(qIndexString)
  }  
  
  const handleIsPrivate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivateA(e.target.checked)
  },[setIsPrivateA])
  
  const handleImportance = (i: number) => {
    setImportance(i)
    console.log(i)
  }  
  
  const handleValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value)
    setValue(e.target.value)
    setResponse(e.target.value)
  }

  const QzContextProps = [
    handleMcRadio,
    handleIsPrivate,
    handleImportance,
    handleValue,
    value,
    currentQ
  ]
  

  return (
    <Stack>
      <Drawer
        isOpen={isOpen}
        placement='bottom'
        onClose={onCloseQz}
        size={'full'}
        blockScrollOnMount={false}
      >
        <DrawerOverlay />
        <DrawerContent>
          {currentQSet && <DrawerHeader>Create your account</DrawerHeader>}
          <DrawerBody>
            <Flex direction={'row'} p={'4'} h={'100%'} justifyContent={'center'} alignItems={'center'}>

              <Outlet context={QzContextProps} />

            </Flex>
          </DrawerBody>
          <DrawerCloseButton top={20}/>

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
          {/* <ArrowNavs /> */}
        </DrawerContent>
      </Drawer>
    </Stack>
  )
}

type QzContextType = [ 
  handleMcRadio: (i: string) => void,
  handleIsPrivate: () => void,
  handleImportance: (i: number) => void,
  handleValue: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
  value: string,
  currentQ: QType
]

export function useQzContext() {
  return useOutletContext<QzContextType>();
}