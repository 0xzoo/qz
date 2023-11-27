import {
  useRadio,
  Box,
  useRadioGroup,
  Stack,
  useColorModeValue
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { CollectionRecordResponse } from '@polybase/client'
import { Az } from '../types/types'


type AzRadioProps = {
  data: string[]
  priorA: CollectionRecordResponse<Az, Az> | undefined
  onChange: (e: any) => void
}

export const AzRadio = ({data, priorA, onChange}: AzRadioProps) => {
  const priorAValue = priorA
    ? data[priorA.data.qIndex as number] as string
    : undefined

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "azRadio",
    defaultValue: priorAValue,
    onChange: onChange,
  })

  const group = getRootProps()

  return (
    <Stack gap={3} {...group}>
      {data.map((item, i) => (
        <CustomRadio 
          key={item} 
          {...getRadioProps({ 
            value: item,
            "aria-posinset": i
          })}
          isDisabled={item == priorAValue}
        >
          {item}
          {item == priorAValue && <CheckCircleIcon ml={2}/>}
        </CustomRadio>
      ))}
    </Stack>
  )
}

const CustomRadio = (props: any) => {
  const { getInputProps, getRadioProps } = useRadio(props)
  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <Box as="label">
      <input {...input} />
      <Box 
        {...checkbox}
        cursor={props.isDisabled ?  'default' : 'pointer'}
        borderWidth='2px'
        borderRadius='md'
        borderColor={useColorModeValue('gray.700','gray.200')}
        boxShadow='md'
        // bg={useColorModeValue('yellow.100','gray.700')}
        px={5}
        py={3}
        _checked={{
          bg: useColorModeValue('white','teal.600'),
          color: useColorModeValue('gray.700','gray.200'),
          borderColor: useColorModeValue('linkedin.600',''),
        }}
        _focus={{
          // boxShadow: 'outline',
        }}
      >
        {props.children}
      </Box>
    </Box>
  )
}