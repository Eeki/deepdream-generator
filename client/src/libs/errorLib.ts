import { createStandaloneToast } from '@chakra-ui/react'

const toast = createStandaloneToast()

export function onError(error?: Error | Record<string, string>): void {
  let message = error?.toString()

  // Auth errors
  if (!(error instanceof Error) && error?.message) {
    message = error.message
  }

  if (!message) {
    message = 'Something went wrong'
  }

  toast({
    title: 'An error occurred.',
    description: message,
    status: 'error',
    duration: 5000,
    isClosable: true,
  })
}
