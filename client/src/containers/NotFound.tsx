import React from 'react'
import { Center, Heading, Flex } from '@chakra-ui/react'

export function NotFound(): JSX.Element {
  return (
    <Flex height="100%" width="100%" flexDir="column" justifyContent="center">
      <Center>
        <Heading as="h3" size="lg">
          Sorry, page not found!
        </Heading>
      </Center>
    </Flex>
  )
}
