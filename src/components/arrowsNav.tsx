import {  
  IconButton,
  Tooltip
} from '@chakra-ui/react'
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from '@chakra-ui/icons'

type ArrowNavProps = {
  onClick: (s: string) => void,
  queueIndex: number,
  qzLength: number
}

export const ArrowNavs = (props: ArrowNavProps) => {
  return (
    <>
      { props.queueIndex > 0 && (
        <Tooltip
          label={'Back'}
          color={'black'}
          bgColor={'transparent'}
          defaultIsOpen={false}
        >
          <IconButton 
            aria-label='Back'
            icon={<ChevronLeftIcon boxSize={10} />}
            size={'lg'}
            // colorScheme={''}
            variant={'ghost'}
            position={'absolute'}
            left={[6, 20]}
            // bottom={['10%', '66%']}
            onClick={() => props.onClick('Back')}
          />
        </Tooltip>
      )}
      { props.queueIndex < props.qzLength -1 && (
        <Tooltip
          label={'Skip'}
          color={'black'}
          bgColor={'transparent'}
          defaultIsOpen={false}
        >
          <IconButton
            aria-label='Forward'
            icon={<ChevronRightIcon boxSize={10} />}
            size={'lg'}
            // colorScheme={'gray'}
            variant={'ghost'}
            position={'absolute'}
            right={[4, 20]}
            // top={'66%'}
            onClick={() => props.onClick('Forward')}
          />
        </Tooltip>
      )}
    </>
  )
}