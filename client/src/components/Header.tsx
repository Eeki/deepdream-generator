import React from 'react'
import { Link as RouteLink } from 'react-router-dom'
import { Heading, Flex, Wrap, WrapItem, Link } from '@chakra-ui/react'
import { headerHeight } from '../libs/const'

interface HeaderProps {
  isAuthenticated: boolean
  handleLogout: () => void
}

const Header = ({
  isAuthenticated,
  handleLogout,
}: HeaderProps): JSX.Element => (
  <Flex
    as="nav"
    align="center"
    justify="space-between"
    wrap="wrap"
    padding="1.5rem"
    bg="teal.500"
    color="white"
    width="100vw"
    height={headerHeight}
  >
    <Flex align="center" mr={5}>
      <RouteLink to="/">
        <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
          Deepdream generator
        </Heading>
      </RouteLink>
    </Flex>
    <div>
      {isAuthenticated ? (
        <Link onClick={handleLogout}>Logout</Link>
      ) : (
        <Wrap spacing="1rem">
          <WrapItem>
            <RouteLink to="/signup">
              <Link as="span">Signup</Link>
            </RouteLink>
          </WrapItem>
          <WrapItem>
            <RouteLink to="/login">
              <Link as="span">Login</Link>
            </RouteLink>
          </WrapItem>
        </Wrap>
      )}
    </div>
  </Flex>
)

export { Header }
