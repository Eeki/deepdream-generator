import React from 'react'
import { Link as RouteLink } from 'react-router-dom'
import { Text, Link } from '@chakra-ui/react'

import './Home.css'

export function Home(): JSX.Element {
  return (
    <div className="Home">
      <Text color="gray.500">Generate dreepdreams from photos and videos</Text>
      <RouteLink to="/run-job">
        <Link as="span">Generate a dreepdream</Link>
      </RouteLink>
    </div>
  )
}
