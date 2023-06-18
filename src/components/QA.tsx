import React, { useEffect, useState, useCallback } from "react"
import {
  Box,
  Stack,
  Text,
  Divider,
  FormControl,
  FormLabel,
  Switch,
  Card,
  CardHeader,
  CardBody,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  Spinner,
  Textarea
} from '@chakra-ui/react'
import { PrivateToggle } from "./privateToggle"
import { generatePath, useParams, useRouteLoaderData } from 'react-router-dom'
import { useQzContext } from '../routes/Qz'
import { useAuth, useIsAuthenticated, useDocument } from "@polybase/react"
import { AzRadio } from "../components/AzRadio"
import { Qz as QType } from '../types/types'

// generatePath("/users/:id", { id: "42" });

export const QA = () => {
  const { auth, state } = useAuth()
  const [
    handleMcRadio,
    handleIsPrivate,
    handleImportance,
    handleValue,
    value,
    currentQ
   ] = useQzContext()
  // const data: any = useRouteLoaderData('Qz')
  // const currentQ: QType = data.data

  const ImportanceSlider = () => {
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
          onChange={handleImportance}
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

  // const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   // !fix check textArea value lengths, show error if too long, or countdown
  //   // if (currentQ.type === "shortText") {}
  //   // if (currentQ.type === "longText") {}    
  //   handleValue(e.target.value)
  // }


  return (
    <>
      <Box>
        <Card minW={'400px'} h={'-webkit-fit-content'} bg={'blue.700'}>
          <CardHeader alignSelf={'end'} paddingBottom={0}>
            {/* <IsPrivateSwitch /> */}
            <PrivateToggle onChange={handleIsPrivate} />
          </CardHeader>
          <CardBody paddingTop={4}>
            <Text fontSize={"xl"} align={'center'} paddingBottom={8}>{currentQ.stem}</Text>
            <Divider marginBottom={8} />
            {currentQ.type === "mc" ? (<AzRadio data={currentQ.az} onChange={handleMcRadio}/>):('')}
            {currentQ.type === "shortText" ? (<Textarea value={value} size={'sm'} h={100} bgColor={'blue.600'} onChange={handleValue}/>):('')}
            {currentQ.type === "longText" ? (<Textarea value={value} size={'lg'} h={200} colorScheme={"twitter"} onChange={handleValue}/>):('')}
          </CardBody>
        </Card>
        {currentQ.importance ? (<ImportanceSlider />):('')}
      </Box>
    </>
  )
}