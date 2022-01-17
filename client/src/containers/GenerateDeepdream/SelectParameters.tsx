import React from 'react'
import {
  Container,
  FormLabel,
  Select,
  Stack,
  Text,
  Box,
} from '@chakra-ui/react'
import { Slider } from '@containers/GenerateDeepdream/Slider'
import type { paramName } from './const'

interface SelectParametersProps {
  params: Record<paramName, number>
  handleChange: (fieldName: paramName) => (param: number) => void
}

const tensorLayers = [
  'Pelkistetyin',
  'Vielä pelkistetympi',
  'pelkistetty',
  'Härö silmä',
  'Silmä',
  'Koira',
  'Enemmän koiria',
  'Eri elukoita',
  'Lintuja',
]

export const SelectParameters = ({
  params,
  handleChange,
}: SelectParametersProps): JSX.Element => (
  <Stack spacing={3} overflow="auto">
    <Container>
      <Box mb={4} mt={4}>
        <FormLabel>Tensor layer</FormLabel>
        <Select value={params.layer_tensor_index}>
          {tensorLayers.map((label, index) => (
            <option key={label} value={index}>
              {label}
            </option>
          ))}
        </Select>
      </Box>
    </Container>
    <Slider
      value={params.num_iterations}
      handleChange={handleChange('num_iterations')}
      label="Number of iterations"
      min={1}
      max={20}
    />
    <Slider
      value={params.num_repeats}
      handleChange={handleChange('num_repeats')}
      label="Number of repeats"
      min={1}
      max={10}
    />
    <Slider
      value={params.step_size}
      handleChange={handleChange('step_size')}
      label="Step size"
      min={1}
      max={6}
      step={0.1}
    />
    <Slider
      value={params.rescale_factor}
      handleChange={handleChange('rescale_factor')}
      label="Rescale factor"
      min={0.1}
      max={2}
      step={0.1}
    />
    <Slider
      value={params.blend}
      handleChange={handleChange('blend')}
      label="Blend"
      min={0.1}
      max={1}
      step={0.1}
    />
  </Stack>
)
