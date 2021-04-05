import React, { useState, FormEvent } from 'react'
import { useHistory } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Stack,
} from '@chakra-ui/react'
import { LoaderButton } from '@components/LoaderButton'
import { useAppContext } from '@libs/contextLib'
import { onError } from '@libs/errorLib'
import { useFormFields } from '@libs/formHooksLib'
import './Login.css'

export default function Login() {
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
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
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
                <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
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
    </div>
  )
}
