import React from 'react'
import { Center, Heading } from '@chakra-ui/react'
import './NotFound.css'

export function NotFound(): JSX.Element {
  return (
    <div className="NotFound">
      <Center>
        <Heading as="h3" size="lg">
          Sorry, page not found!
        </Heading>
      </Center>
    </div>
  )
}
