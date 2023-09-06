import {
  useRadio,
  Box,
  useRadioGroup,
  Stack,
  useColorModeValue
} from '@chakra-ui/react'


type AzRadioProps = {
  data: string[]
  onChange: (e: any) => void
}

export const AzRadio = ({data, onChange}: AzRadioProps) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "azRadio",
    defaultValue: "two",
    onChange: onChange
  })

  const group = getRootProps()

  return (
    <Stack gap={3} {...group}>
      {data.map((item, i) => (
        <CustomRadio 
          key={i} 
          {...getRadioProps({ 
            value: item,
            "aria-posinset": i
          })}
        >
          {item}
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
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        // borderColor={useColorModeValue('','')}
        boxShadow='md'
        bg={useColorModeValue('red.100','gray.700')}
        px={5}
        py={3}
        _checked={{
          bg: useColorModeValue('white','teal.600'),
          color: useColorModeValue('gray.700','gray.200'),
          borderColor: useColorModeValue('teal.600',''),
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