import { useState } from 'react'
import { AzRadio } from './azRadio'
import { Qz, Az } from '../types/types'
import {
  Textarea,
  useColorModeValue
} from '@chakra-ui/react'
import { CollectionRecordResponse } from '@polybase/client'

type responseViewProps = {
  handleMcRadio: (i: string) => void
  value: string | undefined
  handleValue: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  currentQ: Qz
  userAz: CollectionRecordResponse<Az>[] | undefined
  initialRef: React.MutableRefObject<null>
}

export const ResponseView = (props: responseViewProps) => {
  const bgColor = useColorModeValue('white','gray.700')
  const [ edited, setEdited ] = useState<boolean>(false)
  const [ newValue, setNewValue ] = useState<string>()
  const placeholder = props.value
  const priorA = props.userAz && props.userAz[0]

  const handleNewValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!edited) setEdited(true)
    setNewValue(e.target.value)
    props.handleValue(e)
  }

  switch(props.currentQ.type) {
    case 'mc':
      return (
        <AzRadio data={props.currentQ?.az as string[]} priorA={priorA} onChange={props.handleMcRadio}/>
      )
    case 'shortText':
      return (
        <Textarea
          name='answer'
          value={newValue}
          placeholder={placeholder}
          size={'sm'}
          h={100}
          bg={bgColor}
          borderColor={'#e4'}
          onChange={handleNewValue}
          ref={props.initialRef}
        />
      )
    case 'longText':
      return (
        <Textarea
          name='answer'
          value={newValue}
          placeholder={placeholder}
          size={'lg'}
          h={200}
          bg={bgColor}
          borderColor={'#e4'}
          onChange={props.handleValue}
          ref={props.initialRef}
        />
      )
  }
}