
import React, { useState } from "react";
import {
  Box,
  Button,
  Image,
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
  Textarea,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react"
import { QTypeSelect } from './qTypeSelect'
import { ResponseView } from './responseView'
// import { Auth } from '@polybase/auth'
import { nanoid } from 'nanoid'
import { useAuth, useIsAuthenticated, usePolybase } from '@polybase/react'
import { useLogin } from '../auth/useLogin'


export const CreateQModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ prompt, setPrompt ] = useState('')
  const [ isError, setIsError ] = useState(false)  
  const [ responses, setResponses ] = useState(['Yes','No'])
  // enum qzType {
  //   'mc',
  //   'shortText',
  //   'longText',
  //   'ranking'
  // }
  const [ qType, setQType ] = useState('shortText')
  const [ hasImportance, setHasImportance ] = useState(false)
  const polybase = usePolybase()
  const [ isLoggedIn ] = useIsAuthenticated()
  const authState = useAuth().state;
  console.log('createQ reloaded')
  
  const handleCreateQModalButton = () => {
    return isLoggedIn ? (
      onOpen()
    ):(
      useLogin()
    )
  }

  const initialRef = React.useRef(null)

  const handleQTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setQType(e.target.value)
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    e.currentTarget.value === '' ? setIsError(true) : setIsError(false)
    setPrompt(e.currentTarget.value)
  }

  // fix! to make extra responses have '-' button on right, default responses separate
  // '+' button can disappear after 4 responses
  const handleAddResponse = () => {
    if (responses.length < 5) {
      setResponses( arr => [ ...arr, 'Add a response'])
    }
  }

  // !fix add subtractResponse

  const handleAddImportance = () => {
    // !fix add checkbox and state
    setHasImportance(!hasImportance)
  }

  const handleResponseChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let newResponses = responses
    const key = e.currentTarget.ariaPosInSet as unknown as number
    newResponses[key] = e.currentTarget.value
    setResponses(newResponses)
  }

  // Create a new Q
  const createQ = async () => {
    if (prompt === '') {
      setIsError(true)
      return
    } else { setIsError(false) }
    const publicKey = authState?.userId as string
    const user = await polybase.collection('User').record(publicKey).get()
    const timestamp = Date.now()

    let newQ: any = [
      nanoid(), 
      user,
      prompt,
      qType,
      timestamp, 
    ]

    if (qType === 'mc') newQ.push(responses)
    if (hasImportance) newQ.push(hasImportance)

    await polybase.collection('Qz').create(newQ).catch((e) => {throw e})
    // !fix subtract creation cost from user
    // await db.collection('User').record(publicKey).call('createQ')
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
      <Box 
        onClick={handleCreateQModalButton}
      >
        <Image src={useColorModeValue('/addButtonL.svg', '/addButton.svg')} alt='Create a new Q' h={50} w={50} cursor={'pointer'}/>
      </Box>

      <Modal isOpen={isOpen} onClose={closeModal} initialFocusRef={initialRef} >
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(330deg)'
        />
        <ModalContent>
          <ModalHeader display={'flex'} flexDirection={'row'}>
            Create a New Q
          </ModalHeader>
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
          <FormControl mb={6}>
            <FormLabel>Type</FormLabel>
            <QTypeSelect onChange={handleQTypeSelect} value={qType} />
          </FormControl>
          <ResponseView 
            type={qType} 
            responses={responses} 
            onAddResponse={handleAddResponse}
            onAddImportance={handleAddImportance}
            onResponseInput={handleResponseChange}
          />
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