import React from 'react'
import { Route, Redirect, useLocation } from 'react-router-dom'
import { useAppContext } from '@libs/contextLib'

interface AuthenticatedRouteProps {
  children: JSX.Element
  [x: string]: any
}

export function AuthenticatedRoute({
  children,
  ...rest
}: AuthenticatedRouteProps): JSX.Element {
  const { pathname, search } = useLocation()
  const { isAuthenticated } = useAppContext()
  return (
    <Route {...rest}>
      {isAuthenticated ? (
        children
      ) : (
        <Redirect to={`/login?redirect=${pathname}${search}`} />
      )}
    </Route>
  )
}
