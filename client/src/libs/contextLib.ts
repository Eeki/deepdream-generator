import { useContext, createContext } from 'react'
import type { UserInfo, AmplifyConfigs } from './types'

interface AppContext {
  isAuthenticated: boolean
  userHasAuthenticated: (authenticated: boolean) => void
  amplifyConfigs?: AmplifyConfigs
  user?: UserInfo
}

export const AppContext = createContext<AppContext>({} as AppContext)

export function useAppContext(): AppContext {
  return useContext(AppContext)
}
