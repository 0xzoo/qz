import {
  useRadio,
  Box,
  useRadioGroup,
  HStack,
} from '@chakra-ui/react'


type QTypeRadioProps = {
  // data: string[]
  onChange: (e: string) => void,
  value: string
}

export const QTypeRadio = ({onChange, value}: QTypeRadioProps) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "qTypeRadio",
    defaultValue: value,
    onChange: onChange,
  })

  const group = getRootProps()
  // enum qTypes {
  //   'mc' = 'Multiple Choice',
  //   'text' = 'Text'
  // }

  return (
    <HStack gap={3} {...group}>

      <CustomRadio 
        key={'text'} 
        {...getRadioProps({ 
          value: 'text',
          "aria-posinset": 1
        })}
      >
        Text
      </CustomRadio>
      <CustomRadio 
        key={'mc'} 
        {...getRadioProps({ 
          value: 'mc',
          "aria-posinset": 0
        })}
      >
        Multiple Choice
      </CustomRadio>
      <CustomRadio 
        key={'scale'} 
        {...getRadioProps({ 
          value: 'scale',
          "aria-posinset": 0
        })}
      >
        Scale
      </CustomRadio>
    </HStack>
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
        // borderWidth='2px'
        // borderRadius='md'
        // borderColor={useColorModeValue('gray.700','gray.200')}
        // boxShadow='md'
        // bg={useColorModeValue('yellow.100','gray.700')}
        px={5}
        py={3}
        _checked={{
          // bg: useColorModeValue('white','teal.600'),
          color: 'linkedin.500',
          fontWeight: 'bold',
          
          // borderColor: useColorModeValue('linkedin.600',''),
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