import React, { useEffect, useState } from "react"
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
    handleValue  
   ] = useQzContext()
  const data: any = useRouteLoaderData('Qz')
  const currentQ: QType = data.data


  const IsPrivateSwitch = () => {
    return (
      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='isPrivateA' mb='0'>
          Private
        </FormLabel>
        <Switch id='isPrivateA' onChange={handleIsPrivate}/>
      </FormControl>
    )
  }

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

    const onSliderChange = (e: any) => {
      handleImportance(e)
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
          onChange={onSliderChange}
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

  const handleRadioChange = (e: number) => {
    handleMcRadio(e)
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleValue(e.target.value)
    console.log(e.target.value)
  }


  return (
    <>
      <Box>
        <Card minW={'400px'} h={'-webkit-fit-content'} bg={'blue.700'}>
          <CardHeader alignSelf={'end'} paddingBottom={0}>
            <IsPrivateSwitch />
          </CardHeader>
          <CardBody paddingTop={4}>
            <Text fontSize={"xl"} align={'center'} paddingBottom={8}>{currentQ.stem}</Text>
            <Divider marginBottom={8} />
            {currentQ.type === "mc" ? (<AzRadio data={currentQ.az} onChange={handleRadioChange}/>):('')}
            {currentQ.type === "text" ? (<Textarea onChange={handleTextareaChange}/>):('')}
          </CardBody>
        </Card>
        {currentQ.importance ? (<ImportanceSlider />):('')}
      </Box>
    </>
  )
}