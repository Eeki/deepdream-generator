// TODO don't work with graphql

export function onError(error: Error | Record<string, string>) {
  console.log('error', error)
  let message = error.toString()

  // Auth errors
  if (!(error instanceof Error) && error.message) {
    message = error.message
  }

  alert(message)
}
