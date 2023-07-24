import {
  Box,
  Text,
  Heading,
  Divider,
  Flex,
  Center,
  Container,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react'
import { PrivateToggle } from "./privateToggle"
// import { generatePath, useParams, useRouteLoaderData } from 'react-router-dom'
// import { useAuth } from "@polybase/react"
import { AzRadio } from "./azRadio"
import { Qz as QType } from '../types/types'
import React, { memo, useCallback, useState } from 'react'

// generatePath("/users/:id", { id: "42" });

type responseViewProps = {
  questionType: string | undefined
  handleMcRadio: (i: string) => void
  value: string | undefined
  liftValue: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  currentQ: QType | undefined
  initialRef: React.MutableRefObject<null>
}

const ResponseView = (props: responseViewProps) => {
  switch(props.questionType) {
    case 'mc':
      return (
        <AzRadio data={props.currentQ?.az as string[]} onChange={props.handleMcRadio}/>
      )
    case 'shortText':
      return (
        <Textarea 
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

type ImportanceSliderProps = {
  handleImportance: (i: number) => void
}

const ImportanceSlider = (props: ImportanceSliderProps) => {
  const leftLabelStyles = {
    mt: '2',
    ml: '-2.5',
    mr: '2.5',
    fontSize: 'xs',
  }

  const rightLabelStyle = {
    mt: '2',
    ml: '-2.5',
    mr: '2.5',
    fontSize: 'xs',
    left: '86% !important',
    w: 'max-content'
  }

  return (
    <Box>
      <Slider
        defaultValue={50}
        min={0}
        max={100}
        step={25}
        marginTop={4}
        aria-label='slider-ex-6'
        onChange={props.handleImportance}
        >
        <SliderMark value={0} {...leftLabelStyles}>
          Not Important
        </SliderMark>
        <SliderMark value={100} {...rightLabelStyle}>
          Very Important
        </SliderMark>
        <SliderTrack bg='red.100'>
          <SliderFilledTrack bg='tomato' />
        </SliderTrack>
        <SliderThumb boxSize={6} />
      </Slider>
    </Box>
  )
}

type QzContextType = {
  handleMcRadio: (i: string) => void
  handleIsPrivate: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleImportance: (i: number) => void
  handleValue: (s: string) => void
  initialRef: React.MutableRefObject<null>
  currentQ: QType | undefined
}

export const QA = (props: QzContextType) => {
  console.log('qa reloaded')

  const [ value, setValue ] = useState<string>()
  const {
    handleMcRadio,
    handleIsPrivate,
    handleImportance,
    handleValue,
    initialRef,
    currentQ
  } = props

  const liftValue = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    handleValue(e.target.value)
  },[value])

  return (
    <Flex
      direction={'column'}
      justifyContent={'space-between'}
      minH={'100%'}
    >
      <Center flexGrow={2} padding={4}>
        <Heading
          fontSize={'5xl'}
          lineHeight={'shorter'}
          textAlign={'left'}
          fontFamily={'Libre Franklin'}
          color={useColorModeValue('gray.900', 'white')}
        >
          {currentQ?.stem}
        </Heading>
      </Center>
      <Divider ml={[0,4]}/>
      <Container ml={0} my={8}>
        <ResponseView 
          questionType={currentQ?.type}
          handleMcRadio={handleMcRadio}
          value={value}
          liftValue={liftValue}
          currentQ={currentQ}
          initialRef={initialRef}
        />
        <PrivateToggle onChange={handleIsPrivate} />
      </Container>
      {currentQ?.importance ? (<ImportanceSlider handleImportance={handleImportance}/>):('')}
    </Flex>
  )
}