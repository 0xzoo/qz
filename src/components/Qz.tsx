import React, { useEffect } from "react"
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
import { generatePath, Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import { useRootContext } from '../routes/Root'
import { Polybase } from "@polybase/client"

// generatePath("/users/:id", { id: "42" });

// type QzProps = {
//   isLoggedIn: boolean
//   signIn: () => void
// };

export const Qz = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const btnRef = React.useRef(null)
  const navigate = useNavigate();
  const { isLoggedIn, signIn, account, db } = useRootContext();

  useEffect(() => {
    onOpen()
  },[])

  const onCloseQz = () => {
    onClose()
    navigate("/")
  }

  return (
    <Stack>
      {/* <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
        Open
      </Button> */}
      <Drawer
        isOpen={isOpen}
        placement='bottom'
        onClose={onCloseQz}
        size={'full'}
      >
        <DrawerOverlay />
        <DrawerContent>
          {/* <DrawerHeader>Create your account</DrawerHeader> */}

          <DrawerBody>
            <Flex direction={'row'} p={'4'} minH={'50vh'}>
              <Outlet context={{isLoggedIn, signIn, account, db}} />
            </Flex>
          </DrawerBody>
          <DrawerCloseButton />

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onCloseQz}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Stack>
  )
}

type AuthStateType = {
  type: string
  userId: string
  publicKey: string
}

type ContextType = { 
  isLoggedIn: boolean | null
  signIn: () => void
  account: AuthStateType
  db: Polybase
}

export function useQzContext() {
  return useOutletContext<ContextType>();
}