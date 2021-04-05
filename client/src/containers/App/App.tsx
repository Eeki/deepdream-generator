import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import { AppContext } from '@libs/contextLib'
import { onError } from '@libs/errorLib'
import { Routes } from '../../Routes'
import { Header } from '@components/Header'
import './App.css'

function App(): JSX.Element {
  const history = useHistory()
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [isAuthenticated, userHasAuthenticated] = useState(false)

  useEffect(() => {
    onLoad()
  }, [])

  async function onLoad() {
    try {
      await Auth.currentSession()
      userHasAuthenticated(true)
    } catch (e) {
      if (e !== 'No current user') {
        onError(e)
      }
    } finally {
      setIsAuthenticating(false)
    }
  }

  async function handleLogout() {
    await Auth.signOut()

    userHasAuthenticated(false)
    history.push('/login')
  }

  return (
    <div className="App">
      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
        <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        <Routes />
      </AppContext.Provider>
    </div>
  )
}

export default App

// TODO continue this: https://serverless-stack.com/chapters/add-the-create-note-page.html
