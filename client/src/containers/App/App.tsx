import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import { Center, Spinner } from '@chakra-ui/react'
import { AppContext } from '@libs/contextLib'
import { onError } from '@libs/errorLib'
import { Header } from '@components/Header'
import { Routes } from '../../Routes'
import './App.css'
import type { UserInfo, AmplifyConfigs } from '@libs/types'

interface AppProps {
  amplifyConfigs?: AmplifyConfigs
}

function App({ amplifyConfigs }: AppProps): JSX.Element {
  const history = useHistory()
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [isAuthenticated, userHasAuthenticated] = useState(false)
  const [user, setUser] = useState<UserInfo | undefined>()

  useEffect(() => {
    onLoad()
  }, [])

  async function onLoad() {
    try {
      await Auth.currentSession()
      const userInfo = await Auth.currentUserInfo()
      console.log('userInfo', userInfo)
      setUser(userInfo)
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
      <AppContext.Provider
        value={{ isAuthenticated, userHasAuthenticated, user, amplifyConfigs }}
      >
        <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        {isAuthenticating ? (
          <Center h="100%" w="100%">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="teal.500"
              size="xl"
            />
          </Center>
        ) : (
          <Routes />
        )}
      </AppContext.Provider>
    </div>
  )
}

export default App
