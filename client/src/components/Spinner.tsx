import React from 'react'
import { Spinner as ChakraSpinner } from '@chakra-ui/react'

export const Spinner = (): JSX.Element => (
  <ChakraSpinner
    thickness="4px"
    speed="0.65s"
    emptyColor="gray.200"
    color="teal.500"
    size="xl"
  />
)
