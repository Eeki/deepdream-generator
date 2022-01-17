import React, { FormEvent } from 'react'
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react'

import { LoaderButton } from '../../components/LoaderButton'
import type { HTMLInputChangeEvent } from '../../libs/hooks/form'

interface ConfirmationFormProps {
  onFieldChange: (event: HTMLInputChangeEvent) => void
  handleConfirmationSubmit: (event: FormEvent) => void
  confirmationCode: string
  isLoading: boolean
  isValid: boolean
}

export function ConfirmationForm({
  confirmationCode,
  handleConfirmationSubmit,
  onFieldChange,
  isLoading,
  isValid,
}: ConfirmationFormProps): JSX.Element {
  return (
    <form onSubmit={handleConfirmationSubmit}>
      <Stack spacing={6} p="1rem" backgroundColor="whiteAlpha.900">
        <FormControl id="confirmationCode">
          <FormLabel>Confirmation Code</FormLabel>
          <Input
            autoFocus
            type="tel"
            value={confirmationCode}
            onChange={onFieldChange}
          />
          <FormHelperText>Please check your email for the code.</FormHelperText>
        </FormControl>
        <LoaderButton type="submit" isLoading={isLoading} disabled={!isValid}>
          Verify
        </LoaderButton>
      </Stack>
    </form>
  )
}
