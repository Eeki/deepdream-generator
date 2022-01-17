import React, { useState, FormEvent } from 'react'
import { useHistory } from 'react-router-dom'
import Auth from '@aws-amplify/auth'
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Stack,
  Flex,
  Avatar,
  Heading,
  Box,
} from '@chakra-ui/react'
import { LoaderButton } from '@components/LoaderButton'
import { Card } from '@components/Card'
import { useAppContext } from '@libs/contextLib'
import { onError } from '@libs/errorLib'
import { useFormFields } from '@libs/hooks/form'
import { headerHeight } from '@libs/const'

export function Login(): JSX.Element {
  const history = useHistory()
  const { userHasAuthenticated } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)
  const [show, setShow] = React.useState(false)
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
  })

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      await Auth.signIn(fields.email, fields.password)
      userHasAuthenticated(true)
      history.push('/')
    } catch (e) {
      onError(e)
      setIsLoading(false)
    }
  }

  return (
    <Flex
      flexDirection="column"
      width="100vw"
      height={`calc(100vh - ${headerHeight}px)`}
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
        minW="100%"
      >
        <Avatar bg="teal.500" />
        <Heading paddingBottom="1rem" color="teal.400">
          Login
        </Heading>
        <Card width="100%" maxW="468px" justifyContent="center">
          <Box width="100%">
            <form onSubmit={handleSubmit}>
              <Stack spacing={6} p="2rem" backgroundColor="whiteAlpha.900">
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    required
                    type="email"
                    value={fields.email}
                    onChange={handleFieldChange}
                  />
                </FormControl>

                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <InputGroup size="md">
                    <Input
                      required
                      pr="4.5rem"
                      type={show ? 'text' : 'password'}
                      value={fields.password}
                      onChange={handleFieldChange}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShow(!show)}
                      >
                        {show ? 'Hide' : 'Show'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <LoaderButton
                  type="submit"
                  loadingText="Logging in"
                  isLoading={isLoading}
                >
                  Login
                </LoaderButton>
              </Stack>
            </form>
          </Box>
        </Card>
      </Stack>
    </Flex>
  )
}
