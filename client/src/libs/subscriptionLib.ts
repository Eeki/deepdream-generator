import {
  GraphQLAPI,
  graphqlOperation,
  GraphQLResult,
} from '@aws-amplify/api-graphql'
import type { Observable } from 'zen-observable-ts'
import type { ZenObservable } from 'zen-observable-ts/lib/types'

export interface ObservableGraphQLResult<T> {
  value: GraphQLResult<T>
}

export function subscribeGql<T>(
  gqlQuery: string,
  variables: Record<string, unknown>,
  next: (value: T) => void
): ZenObservable.Subscription {
  return (
    GraphQLAPI.graphql(graphqlOperation(gqlQuery, variables)) as Observable<T>
  ).subscribe({
    next: next,
    error: (error: Error) => console.error('subscription error', error),
  })
}
