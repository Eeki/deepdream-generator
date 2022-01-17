import React, { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Auth from '@aws-amplify/auth'
import { Stack, Avatar, Heading, Flex, Box } from '@chakra-ui/react'

import { Card } from '@components/Card'
import { useAppContext } from '@libs/contextLib'
import { useFormFields } from '@libs/hooks/form'
import { onError } from '@libs/errorLib'
import { SignupForm } from './SignupForm'

import type { ISignUpResult } from 'amazon-cognito-identity-js'
import { ConfirmationForm } from '@containers/Signup/ConfirmationForm'
import { headerHeight } from '@libs/const'

export function Signup(): JSX.Element {
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
          Signup
        </Heading>
        <Card width="100%" maxW="468px" justifyContent="center">
          <Box width="100%">
            {newUser === null ? (
              <SignupForm
                onSubmit={handleSubmit}
                onFieldChange={handleFieldChange}
                email={fields.email}
                password={fields.password}
                confirmPassword={fields.confirmPassword}
                isLoading={isLoading}
                isValid={validateForm()}
              />
            ) : (
              <ConfirmationForm
                onFieldChange={handleFieldChange}
                handleConfirmationSubmit={handleConfirmationSubmit}
                confirmationCode={fields.confirmationCode}
                isLoading={isLoading}
                isValid={validateConfirmationForm()}
              />
            )}
          </Box>
        </Card>
      </Stack>
    </Flex>
  )
}
