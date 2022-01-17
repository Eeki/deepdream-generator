import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './containers/App/App'
import { amplifyConfigure } from './libs/amplifyLib'
import './index.css'

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })

amplifyConfigure().then(
  amplifyConfigs =>
    ReactDOM.render(
      <React.StrictMode>
        <ChakraProvider theme={theme} resetCSS={true}>
          <Router>
            <App amplifyConfigs={amplifyConfigs} />
          </Router>
        </ChakraProvider>
      </React.StrictMode>,
      document.getElementById('root')
    ),
  error => alert(`Failed to initialize the app. ${error}`)
)
