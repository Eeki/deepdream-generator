import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Home } from '@containers/Home'
import { Login } from '@containers/Login'
import { Signup } from '@containers/Signup'
import { NotFound } from '@containers/NotFound'
import { AuthenticatedRoute } from '@components/AuthenticatedRoute'
import { UnauthenticatedRoute } from '@components/UnauthenticatedRoute'

export function Routes(): JSX.Element {
  return (
    <Switch>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup">
        <Signup />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/">
        <Home />
      </AuthenticatedRoute>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  )
}
