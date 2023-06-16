import {  
  IconButton,
  Tooltip
} from '@chakra-ui/react'
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from '@chakra-ui/icons'


  const ArrowNavs = () => {
    return (
      <>
        <Tooltip
          label={'Back'}
          color={'white'}
          bgColor={'gray.700'}
          defaultIsOpen={true}
        >
          <IconButton 
            aria-label='Back'
            icon={<ChevronLeftIcon boxSize={10} />}
            size={'lg'}
            colorScheme='blue'
            variant={'ghost'}
            position={'absolute'}
            left={20}
            top={'45%'}
          />
        </Tooltip>
        <Tooltip
          label={'Skip'}
          color={'white'}
          bgColor={'gray.700'}
          defaultIsOpen={true}
        >
          <IconButton
            aria-label='Forward'
            icon={<ChevronRightIcon boxSize={10} />}
            size={'lg'}
            colorScheme='blue'
            variant={'ghost'}
            position={'absolute'}
            right={20}
            top={'45%'}
          />
        </Tooltip>
      </>
    )
  }