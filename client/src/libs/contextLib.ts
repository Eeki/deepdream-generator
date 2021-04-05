import { useContext, createContext } from 'react'

interface AppContext {
  isAuthenticated: boolean
  userHasAuthenticated: (authenticated: boolean) => void
}

export const AppContext = createContext<AppContext>({} as AppContext)

export function useAppContext() {
  return useContext(AppContext)
}
