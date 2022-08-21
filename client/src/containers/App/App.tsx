import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Auth from '@aws-amplify/auth'
import { Center, Box } from '@chakra-ui/react'

import { AppContext } from '../../libs/contextLib'
import { headerHeight } from '../../libs/const'
import { onError } from '../../libs/errorLib'
import { Header } from '../../components/Header'
import { Spinner } from '../../components/Spinner'
import { Routes } from '../../Routes'

import type { UserInfo, AmplifyConfigs } from '../../libs/types'

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
  }, [isAuthenticated])

  async function onLoad() {
    if (!user) {
      try {
        setIsAuthenticating(true)
        await Auth.currentSession()
        const userInfo = await Auth.currentUserInfo()
        setUser(userInfo)
        userHasAuthenticated(true)
      } catch (e: any) {
        if (e !== 'No current user') {
          onError(e)
        }
      } finally {
        setIsAuthenticating(false)
      }
    }
  }

  async function handleLogout() {
    await Auth.signOut()
    userHasAuthenticated(false)
    history.push('/login')
  }

  return (
    <Box height="100%" width="100%" position="relative">
      <AppContext.Provider
        value={{ isAuthenticated, userHasAuthenticated, user, amplifyConfigs }}
      >
        <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        {isAuthenticating ? (
          <Center h="100%" w="100%">
            <Spinner />
          </Center>
        ) : (
          <Box height={`calc(100% - ${headerHeight}px)`} width="100%">
            <Routes />
          </Box>
        )}
      </AppContext.Provider>
    </Box>
  )
}

export default App
