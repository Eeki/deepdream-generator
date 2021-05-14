// TODO don't work with graphql

export function onError(error?: Error | Record<string, string>): void {
  let message = error?.toString()

  // Auth errors
  if (!(error instanceof Error) && error?.message) {
    message = error.message
  }

  if (!message) {
    message = 'Something went wrong'
  }

  alert(message)
}
