import React, { FormEvent, useState } from 'react'
import Auth from '@aws-amplify/auth'
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Stack,
} from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'
import { LoaderButton } from '@components/LoaderButton'
import { useAppContext } from '@libs/contextLib'
import { useFormFields } from '@libs/hooks/form'
import { onError } from '@libs/errorLib'
import './Signup.css'

import type { ISignUpResult } from 'amazon-cognito-identity-js'

// TODO Test that the sign up really works
export function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
  })
  const history = useHistory()
  const [newUser, setNewUser] = useState<ISignUpResult | null>(null)
  const { userHasAuthenticated } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    )
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    setIsLoading(true)

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      })
      setIsLoading(false)
      setNewUser(newUser)
    } catch (e) {
      onError(e)
      setIsLoading(false)
    }
  }

  async function handleConfirmationSubmit(event: FormEvent) {
    event.preventDefault()

    setIsLoading(true)

    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode)
      await Auth.signIn(fields.email, fields.password)

      userHasAuthenticated(true)
      history.push('/')
    } catch (e) {
      onError(e)
      setIsLoading(false)
    }
  }

  // TODO split this as own component
  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <Stack spacing={4}>
          <FormControl id="confirmationCode">
            <FormLabel>Confirmation Code</FormLabel>
            <Input
              autoFocus
              type="tel"
              value={fields.confirmationCode}
              onChange={handleFieldChange}
            />
            <FormHelperText>
              Please check your email for the code.
            </FormHelperText>
          </FormControl>
          <LoaderButton
            type="submit"
            isLoading={isLoading}
            disabled={!validateConfirmationForm()}
          >
            Verify
          </LoaderButton>
        </Stack>
      </form>
    )
  }

  // TODO split this as own component
  function renderForm() {
    return (
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              autoFocus
              type="email"
              value={fields.email}
              onChange={handleFieldChange}
            />
          </FormControl>

          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={fields.password}
              onChange={handleFieldChange}
            />
          </FormControl>

          <FormControl id="confirmPassword">
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              value={fields.confirmPassword}
              onChange={handleFieldChange}
            />
          </FormControl>

          <LoaderButton
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Signup
          </LoaderButton>
        </Stack>
      </form>
    )
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  )
}
