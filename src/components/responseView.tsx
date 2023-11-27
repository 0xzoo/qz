import { 
  // useEffect,
  // FocusEvent,
  useState
} from 'react'
import { AzRadio } from './azRadio'
import { ScaleRadio } from './scaleRadio'
import { responseViewProps } from '../types/types'
import {
  Textarea,
  useColorModeValue
} from '@chakra-ui/react'
// import { CollectionRecordResponse } from '@polybase/client'
// import { useAuth } from '@polybase/react'
// import { getPriorAz } from '../pb/functions'



export const ResponseView = (props: responseViewProps) => {
  const [ edited, setEdited ] = useState<boolean>(false)
  const [ newValue, setNewValue ] = useState<string>()
  const [ inFocus, setInFocus ] = useState<boolean>(false)
  // const [ userAz, setUserAz ] = useState<CollectionRecordResponse<Az, Az>[]>()
  const placeholder = props.value
  const priorA = props.userAz && props.userAz[0]
  const bgColor = useColorModeValue('#ffff00','gray.700')
  const borderStyle = inFocus ? 'none' : '3px solid'
  // const { state } = useAuth()

  // useEffect(() => {
  //   console.log('currentQ', props.currentQ?.id)
  //   getPriorAz(props.currentQ.id, state?.userId as string)
  //     .then(az => {
  //       if (az.length) {
  //         setUserAz(az)
  //         const newestA = az[0].data
  //         switch (currentQ?.data.type) {
  //           case 'mc':
  //             const newestAQIndex = newestA.qIndex
  //             setValue('')
  //             setQIndex(newestAQIndex)
  //             break
  //           case 'text':
  //             const newestAValue = newestA.value as string
  //             setValue(newestAValue)
  //             setQIndex(undefined)
  //             break
  //           case 'scale':
  //             const newestAScaleValue = newestA.value as string
  //             setValue(newestAScaleValue)
  //             setQIndex(undefined)
  //             break
  //         }
  //       } else {
  //         setValue('') // !fix change to undefined
  //         setQIndex(undefined)
  //       }
  //     })
  // },[])

  const handleNewTextValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!edited) setEdited(true)
    const s = e.target.value
    setNewValue(s)
    props.handleValue(s)
  }

  const handleTextAreaFocus = () => {
    setInFocus(!inFocus)
  }

  switch(props.currentQ.type) {
    case 'mc':
      return (
        <AzRadio data={props.currentQ?.az as string[]} priorA={priorA} onChange={props.handleMcRadio}/>
      )
    case 'text':
      return (
        <Textarea
          name='answer'
          variant={'unstyled'}
          value={newValue}
          placeholder={placeholder}
          size={'lg'}
          h={200}
          p={inFocus ? 4 : 3}
          bg={bgColor}
          border={borderStyle}
          colorScheme={'linkedin'}
          onFocus={handleTextAreaFocus}
          onBlur={handleTextAreaFocus}
          onChange={handleNewTextValue}
          ref={props.initialRef}  // !fix check to see if this is necessary, else handle login modal
        />
      )
    case 'scale':
      return (
        <ScaleRadio
          onChange={props.handleValue}
          value={priorA?.data.value}
          responses={props.currentQ?.az as string[]}
        />
      )
  }
}