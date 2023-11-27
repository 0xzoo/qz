import { ViewIcon } from '@chakra-ui/icons'
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Link,
  Text,
  useDisclosure,
  useRadio,
  useRadioGroup,
  // useColorModeValue
} from '@chakra-ui/react'
import { useState } from 'react'

// !fix delete?
// enum audienceType {

// }


type PrivacyDrawerProps = {
  onChange?: (e: string) => void,
  value?: string
}

//
const CustomRadio = (props: any) => {
  const { getInputProps, getRadioProps } = useRadio(props)
  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <Flex 
      h={'21px'}
      // w={'48px'}
      as="label"
      justifyContent={'center'}
      alignItems={'center'}
    >
      <input {...input}/>
      <Flex 
        {...checkbox}
        cursor={props.isDisabled ? 'default' : 'pointer'}
        // borderWidth='6px'
        // borderRadius='md'
        // borderColor={props.color}
        // boxShadow='md'
        // bg={props.bg}
        // borderRadius={'50%'}
        // h={props.size + 'px'}
        // w={props.size + 'px'}
        alignItems={'left'}
        justifyContent={'center'}
        _checked={{
          color: 'linkedin.600',
          fontWeight: 'md'
        }}
        _focus={{
          color: 'linkedin.600'
        }}
        _invalid={props.isValid}
      >
        {props.children}
      </Flex>
    </Flex>
  )
}

// 
const PrivacyRadio = ({ onChange, value }: PrivacyDrawerProps) => {
  const options = [
    'Only Me',
    'My Followers',
    'Allowlist Only',
    'Everyone',
    'Anon'
  ]

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "scaleRadio",
    onChange: onChange,
  })

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
        { options.map((e, i) => (
          <CustomRadio 
            key={e[0]} 
            {...getRadioProps({ 
              value: e,
              "aria-posinset": i,
              // isValid: isValid,
            })}
            isDisabled={e[0] == value}
            bg={e[0] == value ? e[1] : 'transparent'}
          >
            <Text>{e}</Text>
          </CustomRadio>
        ))}
      </Flex>
    </Flex>
  )
}

export const PrivacyDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ audience, setAudience ] = useState<string>()

  const handleChange = (s: string) => {
    setAudience(s)
  }

  return (
    <>
      <Link
        onClick={onOpen}
      >
        <Text>
          <ViewIcon /> {audience}
        </Text>
      </Link>
      <Drawer
        isOpen={isOpen}
        placement={'bottom'}
        onClose={onClose}
        size={'md'}
        blockScrollOnMount={false}
        // initialFocusRef={initialRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <Text>Share with</Text>
          </DrawerHeader>
          <DrawerBody>
            <PrivacyRadio onChange={handleChange} value={audience}/>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}