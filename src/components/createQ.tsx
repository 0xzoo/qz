
import React, { useState } from "react";
import { 
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  useDisclosure
} from "@chakra-ui/react"
// import { Auth } from '@polybase/auth'
import { nanoid } from 'nanoid'
import { useRootContext, getPublicKey } from '../routes/Root'

type createQModalProps = {
  isLoggedIn: boolean
  signIn: () => void
};

// const auth = new Auth();

export const CreateQModal = ({isLoggedIn, signIn}: createQModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ prompt, setPrompt ] = useState('')
  const [ isError, setIsError ] = useState(false)  
  const [ responses, setResponses ] = useState(['Yes','No'])
  const { db, account } = useRootContext()
  
  const handleCreateQModalButton = () => {
    return isLoggedIn ? (
      onOpen()
    ):(
      signIn ()
    )
  }

  const initialRef = React.useRef(null)

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    e.currentTarget.value === '' ? setIsError(true) : setIsError(false)
    setPrompt(e.currentTarget.value)
  }

  // fix! to make extra responses have '-' button on right, default responses separate
  // '+' button can disappear after 4 responses
  const handleAddResponse = () => {
    if (responses.length < 4) {
      setResponses( arr => [ ...arr, 'Add a response'])
    }
  }

  const handleResponseChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let newResponses = responses
    const key = e.currentTarget.ariaPosInSet as unknown as number
    newResponses[key] = e.currentTarget.value
    setResponses(newResponses)
  }

  // id: string, owner: User, stem: string, type: string, timestamp: number, az: string[]

  // Create a new Q
  const createQ = async () => {
    if (prompt === '') {
      setIsError(true)
      return
    } else { setIsError(false) }
    const stem = prompt
    const type = "mc"
    // const publicKey = auth?.wallet?.getPublicKeyString() // !fix
    const publicKey = account.publicKey
    const user = await db.collection('User').record(publicKey).get()
    // console.log('user', user)
    const timestamp = Date.now()
    const answers = responses
    await db.collection('Qz').create([
      nanoid(), 
      user,
      stem,
      type,
      timestamp, 
      answers
    ])
    closeModal()
  }

  const closeModal = () => {
    setPrompt('')
    setIsError(false)
    setResponses(['Yes', 'No'])
    onClose()
  }

  return (
    <>
      <Button onClick={handleCreateQModalButton}>Create a New Q</Button>

      <Modal isOpen={isOpen} onClose={closeModal} initialFocusRef={initialRef} >
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(330deg)'
        />
        <ModalContent>
          <ModalHeader>Create a New Q</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <FormControl mb={6} isInvalid={isError} >
            <FormLabel>Prompt</FormLabel>
            <Textarea
              color={'white'}
              placeholder='Ask away'
              _placeholder={{ opacity: .8, color: 'inherit' }}
              size={'lg'} 
              ref={initialRef}
              value={prompt}
              onChange={handleTextareaChange}
            />
            {isError && (
              <FormErrorMessage>Prompt is required.</FormErrorMessage>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Responses</FormLabel>
            {responses.map((res, i) => {
              return (
                <Input 
                  placeholder= {res}
                  color='white'
                  type='text'
                  mb={3}
                  key={i}
                  aria-posinset={i}
                  _placeholder={{
                    opacity: .7,
                    color: 'inherit'
                  }}
                  onChange={handleResponseChange}
                />
              )
            })}
            <Button onClick={handleAddResponse}>+</Button>
          </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={createQ}>
              Save
            </Button>
            <Button variant='ghost' onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}