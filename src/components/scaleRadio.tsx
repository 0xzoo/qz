import {
  useRadio,
  useRadioGroup,
  Flex,
  Text,
  useColorModeValue,
  Center
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react'

// enum scaleColors {
//   'Strong Disagree' = '#FF0000',
//   'Medium Disagree' = "#CC4C4C",
//   'Light Disagree' = "#996E6E",
//   'No Opinion' = "#808080",
//   'Light Agree' = "#4C996E",
//   'Medium Agree' = "#4CCC4C",
//   'Strong Agree' = "#008000"
// }

// const colorScale = [
//   ['Strong Disagree', '#FF0000', 48],
//   ['Medium Disagree', "#F05858", 44],
//   ['Light Disagree', "#F3A4A4", 40],
//   ['No Opinion', "#E2E2E2", 36],
//   ['Light Agree', "#A5EEA5", 40],
//   ['Medium Agree', "#7BFF7B", 44],
//   ['Strong Agree', "#00FF00", 48]
// ]

type ScaleRadioProps = {
  onChange?: (e: string) => void,
  value?: string,
  responses: string[]
}

export const ScaleRadio = ({onChange, value, responses}: ScaleRadioProps) => {
  const [ newValue, setNewValue ] = useState<string | undefined>(value)
  const isValid = !!onChange
  const handleChange = (s: string) => {
    setNewValue(s)
    if (onChange) onChange(s)
  }

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "scaleRadio",
    onChange: handleChange,
  })

  useEffect(() => {
    setNewValue(value)
  },[value])

  const grayScale = [
    [responses[1], '#5f5f5f', 48],
    ['Mostly ' + responses[1], "#828282", 44],
    ['Leaning ' + responses[1], "#B2B2B2", 40],
    ['Neutral', "#E2E2E2", 36],
    ['Leaning ' + responses[0], "#B2B2B2", 40],
    ['Mostly ' + responses[0], "#828282", 44],
    [responses[0], "#5f5f5f", 48]
  ]

  const group = getRootProps()

  return (
    <Flex
      flexDir={'column'}
      mt={4}
      gap={4}
    >
      <Flex
        flexDir={'row'}
        justifyContent={'space-between'}
        {...group}
      >
        { grayScale.map((e, i) => (
          <CustomRadio 
            key={e[0]} 
            {...getRadioProps({ 
              value: e[0],
              "aria-posinset": i,
              color: e[1],
              isValid: isValid,
              size: e[2],
            })}
            isDisabled={e[0] == value}
            bg={e[0] == value ? e[1] : 'transparent'}
          >
            {e[0] == value && <CheckIcon />}
          </CustomRadio>
        ))}
      </Flex>
      <Flex
        flexDir={'row'}
        justifyContent={'space-between'}
      >
        <Text maxWidth={'45%'}>{responses[1]}</Text>
        <Text maxWidth={'45%'}>{responses[0]}</Text>
      </Flex>
      <Center><Text>{newValue}</Text></Center>
    </Flex>
  )
}

const CustomRadio = (props: any) => {
  const { getInputProps, getRadioProps } = useRadio(props)
  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <Flex 
      h={'48px'}
      as="label"
      justifyContent={'center'}
      alignItems={'center'}
    >
      <input {...input}/>
      <Flex 
        {...checkbox}
        cursor={props.isDisabled ? 'default' : 'pointer'}
        borderWidth='6px'
        borderColor={props.color}
        bg={props.bg}
        borderRadius={'50%'}
        h={props.size + 'px'}
        w={props.size + 'px'}
        alignItems={'center'}
        justifyContent={'center'}
        _checked={{
          bg: props.color,          
          borderColor: useColorModeValue('linkedin.600',''),
        }}
        _focus={{
        }}
        _invalid={props.isValid}
      >
        {props.children}
      </Flex>
    </Flex>
  )
}