import React from 'react'
import {
  Slider as ChakraSlider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormLabel,
  Container,
} from '@chakra-ui/react'

interface SliderProps {
  label: string
  value: number
  handleChange: (value: number) => void
  min: number
  max: number
  step?: number
}

export const Slider = ({
  label,
  value,
  handleChange,
  min,
  max,
  step = 1,
}: SliderProps): JSX.Element => {
  return (
    <Container>
      <FormLabel>{label}</FormLabel>
      <ChakraSlider
        flex="1"
        focusThumbOnChange={false}
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
      >
        <SliderTrack>
          <SliderFilledTrack bg="teal" />
        </SliderTrack>
        <SliderThumb fontSize="sm" boxSize="32px" children={value} />
      </ChakraSlider>
    </Container>
  )
}
