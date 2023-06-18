import React from 'react'
import {
  useRadio,
  Box,
  useRadioGroup,
  Stack
} from '@chakra-ui/react'


type AzRadioProps = {
  data: string[]
  onChange: (e: any) => void
}

export const AzRadio = ({data, onChange}: AzRadioProps) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "test",
    defaultValue: "two",
    onChange: onChange
  })

  const group = getRootProps()

  return (
    <Stack {...group}>
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
  );
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
        boxShadow='md'
        px={5}
        py={3}
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
      >
        {props.children}
      </Box>
    </Box>
  )
}