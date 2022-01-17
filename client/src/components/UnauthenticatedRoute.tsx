import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAppContext } from '../libs/contextLib'

interface UnauthenticatedRouteProps {
  children: JSX.Element
  [x: string]: any
}

export function UnauthenticatedRoute({
  children,
  ...rest
}: UnauthenticatedRouteProps): JSX.Element {
  const { isAuthenticated } = useAppContext()
  return (
    <Route {...rest}>{!isAuthenticated ? children : <Redirect to="/" />}</Route>
  )
}
