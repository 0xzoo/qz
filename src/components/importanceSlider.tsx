import { 
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderMark,
  SliderThumb
} from '@chakra-ui/react'

type ImportanceSliderProps = {
  handleImportance: (i: number) => void
}

export const ImportanceSlider = (props: ImportanceSliderProps) => {
  const leftLabelStyles = {
    mt: '2',
    ml: '-2.5',
    mr: '2.5',
    fontSize: 'xs',
  }

  const rightLabelStyle = {
    mt: '2',
    ml: '-2.5',
    mr: '2.5',
    fontSize: 'xs',
    left: '86% !important',
    w: 'max-content'
  }

  return (
    <Box>
      <Slider
        defaultValue={50}
        min={0}
        max={100}
        step={25}
        marginTop={4}
        aria-label='slider-ex-6'
        onChange={props.handleImportance}
        >
        <SliderMark value={0} {...leftLabelStyles}>
          Not Important
        </SliderMark>
        <SliderMark value={100} {...rightLabelStyle}>
          Very Important
        </SliderMark>
        <SliderTrack bg='red.100'>
          <SliderFilledTrack bg='tomato' />
        </SliderTrack>
        <SliderThumb boxSize={6} />
      </Slider>
    </Box>
  )
}