import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { Amplify, Auth } from 'aws-amplify'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './containers/App/App'
import './index.css'
import {
  SNOWPACK_PUBLIC_AWS_REGION,
  SNOWPACK_PUBLIC_CLIENT_DATA_BUCKET,
  SNOWPACK_PUBLIC_USER_POOL_ID,
  SNOWPACK_PUBLIC_APP_CLIENT_ID,
  SNOWPACK_PUBLIC_IDENTITY_POOL_ID,
  SNOWPACK_PUBLIC_FILES_API_ENDPOINT,
} from '@libs/configLib'

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: SNOWPACK_PUBLIC_AWS_REGION,
    userPoolId: SNOWPACK_PUBLIC_USER_POOL_ID,
    identityPoolId: SNOWPACK_PUBLIC_IDENTITY_POOL_ID,
    userPoolWebClientId: SNOWPACK_PUBLIC_APP_CLIENT_ID,
  },
  Storage: {
    region: SNOWPACK_PUBLIC_AWS_REGION,
    bucket: SNOWPACK_PUBLIC_CLIENT_DATA_BUCKET,
    identityPoolId: SNOWPACK_PUBLIC_IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: 'files',
        endpoint: SNOWPACK_PUBLIC_FILES_API_ENDPOINT,
        region: SNOWPACK_PUBLIC_AWS_REGION,
        custom_header: async () => ({
          Authorization: `Bearer ${(await Auth.currentSession())
            .getIdToken()
            .getJwtToken()}`,
        }),
      },
    ],
  },
})

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme} resetCSS={true}>
      <Router>
        <App />
      </Router>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

if (import.meta.hot) {
  import.meta.hot.accept()
}
