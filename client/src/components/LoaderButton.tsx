import React from 'react'
import { Button, ButtonProps } from '@chakra-ui/react'

export function LoaderButton({
  isLoading,
  disabled = false,
  loadingText,
  ...props
}: ButtonProps): JSX.Element {
  return (
    <Button
      isLoading={isLoading}
      disabled={disabled || isLoading}
      loadingText={loadingText}
      colorScheme="teal"
      variant="outline"
      {...props}
    >
      {props.children}
    </Button>
  )
}
