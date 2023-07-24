import React, { memo } from 'react'
import {
  FormControl,
  FormLabel,
  Switch
} from '@chakra-ui/react'

type ToggleProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const PrivateToggle = memo(function PrivateToggle(props: ToggleProps) {
  return (
    <FormControl display='flex' alignItems='center' mt={4}>
      <FormLabel htmlFor='isPrivateA' mb='0'>
        Private
      </FormLabel>
      <Switch id='isPrivateA' onChange={props.onChange} />
    </FormControl>
  )
})