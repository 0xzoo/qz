import { useEffect, useState } from "react"
import { generatePath, Outlet, useNavigate, useOutletContext, useParams, useLoaderData } from 'react-router-dom'
import { usePolybase, useDocument } from "@polybase/react"
import { useAuth } from "@polybase/react"
import { secp256k1 } from "@polybase/util"
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
import { Qz as Q, User, Owner, AType, loaderData } from "../types/types"


export const Qz = () => {
  const polybase = usePolybase()
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ currentQSet, setCurrentQSet ] = useState(null)
  const [ qIndex, setQIndex ] = useState<string | null>(null)
  const [ value, setValue ] = useState<string | null>(null)
  const [ isPrivateA, setIsPrivateA ] = useState<boolean>(false)
  const [ importance, setImportance ] = useState<number | null>(null)
  const [ asset, setAsset ] = useState<string | null>(null)
  const [ response, setResponse ] = useState<string | number | null>(null)
  const authState = useAuth().state;

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
    // const qData= data.data as Q
    // setCurrentQId(qId)
  },[])

  const onCloseQz = () => {
    onClose()
    navigate("/")
  }

  const onSubmitA = async () => {
    const owner = {
      collectionId: "pk/0x4d5de3518af7848d4997a0749bcdfa49582ba156231afdb227818cf802dc597d593c0faa1604eaa2e0ac3867555cf07fe0c902e1b7893cd7a9b3feb0e4bd1489/QzTest2/User",
      id: authState?.userId as string
    }
    const qId = {
      collectionId: data.collection as string,
      id: data.data.id as string
    }

    const timestamp = Date.now()

    let newA: any = [
      nanoid(),
      owner,
      qId,
      timestamp,
      isPrivateA,
    ]

    if (typeof qIndex != null) {
      newA.push(qIndex as unknown as number)
    }
    if (typeof value != null) newA.push(value as string)
    if (isPrivateA) {
      // encrypt asymm
      const encryptedValueAsHexStr = await secp256k1.asymmetricEncryptToEncoding(
        publicKey,
        "top secret info"
      );
    }
    if (typeof importance != null) newA.push(importance as number)

    console.log('newA', newA)
    await polybase.collection('Az').create([newA]).catch((e) => {throw e})
    await polybase.collection('Qz').record(qId.id).call("incrNumAz").catch((e) => {throw e})
    // generatePath("/users/:id", { id: "42" });
    // navigate
  }


  const handleMcRadio = (i: string): void => {
    const qIndex = data.data.az.indexOf(i)
    setQIndex(qIndex)
    setResponse(qIndex)
  }  
  
  const handleIsPrivate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivateA(e.target.checked)
    console.log('private')
  }  
  
  const handleImportance = (i: number) => {
    setImportance(i)
  }  
  
  const handleValue = (i: string) => {
    setValue(i)
    setResponse(i)
  }

  const QzContextProps = [
    handleMcRadio,
    handleIsPrivate,
    handleImportance,
    handleValue  
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
              <Button colorScheme='blue' onClick={onSubmitA}>
                {response ? ('Save and Next'):('Skip')}
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
  handleQIndex: (i: number) => void,
  handleIsPrivate: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleImportance: (i: number) => void,
  handleValue: (i: string) => void,
]

export function useQzContext() {
  return useOutletContext<QzContextType>();
}