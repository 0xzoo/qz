// import { useState } from 'react'
import { AzRadio } from './azRadio'
import { Qz } from '../types/types'
import {
  Textarea,
  useColorModeValue
} from '@chakra-ui/react'

type responseViewProps = {
  questionType: string
  handleMcRadio: (i: string) => void
  value: string | undefined
  liftValue: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  currentQ: Qz
  initialRef: React.MutableRefObject<null>
}

export const ResponseView = (props: responseViewProps) => {
  // const [ value, setValue ] = useState<string>()

  // const handleValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setValue(e.target.value)
  // }

  switch(props.questionType) {
    case 'mc':
      return (
        <AzRadio data={props.currentQ?.az as string[]} onChange={props.handleMcRadio}/>
      )
    case 'shortText':
      return (
        <Textarea
          name='answer'
          value={props.value}
          size={'sm'}
          h={100}
          bg={useColorModeValue('white','gray.700')}
          borderColor={'#e4'}
          onChange={props.liftValue}
          ref={props.initialRef}
        />
      )
    case 'longText':
      return (
        <Textarea
          name='answer'
          value={props.value}
          size={'lg'}
          h={200}
          bg={useColorModeValue('white','gray.700')}
          borderColor={'#e4'}
          onChange={props.liftValue}
          ref={props.initialRef}
        />
      )
  }
}