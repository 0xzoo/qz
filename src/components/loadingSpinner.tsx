import { 
  Flex,
  Spinner,
  useColorModeValue
} from "@chakra-ui/react"

export const LoadingSpinner = () => {
  const bgColor = useColorModeValue('#ffff00b3', '#1a202cb8')

  return (
    <Flex
      w={'100vw'}
      bg={bgColor}
      pos={'absolute'}
      top={'80px'}
      bottom={0}
      zIndex={'1500'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size='xl'
      />
    </Flex>
  )
}