import React, { FormEvent } from 'react'
import { FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'

import { LoaderButton } from '@components/LoaderButton'
import type { HTMLInputChangeEvent } from '@libs/hooks/form'

interface SignupFormProps {
  onFieldChange: (event: HTMLInputChangeEvent) => void
  onSubmit: (event: FormEvent) => void
  email: string
  password: string
  confirmPassword: string
  isLoading: boolean
  isValid: boolean
}

export function SignupForm({
  onSubmit,
  onFieldChange,
  email,
  password,
  confirmPassword,
  isLoading,
  isValid,
}: SignupFormProps): JSX.Element {
  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={6} p="2rem" backgroundColor="whiteAlpha.900">
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            autoFocus
            type="email"
            value={email}
            onChange={onFieldChange}
          />
        </FormControl>

        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={onFieldChange} />
        </FormControl>

        <FormControl id="confirmPassword">
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            value={confirmPassword}
            onChange={onFieldChange}
          />
        </FormControl>

        <LoaderButton
          type="submit"
          loadingText="Signing in"
          isLoading={isLoading}
          disabled={!isValid}
        >
          Signup
        </LoaderButton>
      </Stack>
    </form>
  )
}
