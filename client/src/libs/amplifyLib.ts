import { Amplify, Auth } from 'aws-amplify'
import axios from 'axios'
import type { ApiEndpoint, AmplifyConfigs } from './types'

const getEndpoints = (
  endpointNames: string[],
  region: string,
  apiEndpointUrl: string
): ApiEndpoint[] =>
  endpointNames.map(endpointName => ({
    name: endpointName,
    endpoint: apiEndpointUrl,
    region: region,
    custom_header: async () => ({
      Authorization: `Bearer ${(await Auth.currentSession())
        .getIdToken()
        .getJwtToken()}`,
    }),
  }))

// TODO type better
export const amplifyConfigure = async (): Promise<
  AmplifyConfigs | undefined
> => {
  try {
    const {
      data: {
        region,
        userDataBucket,
        userPoolId,
        userPoolWebClientId,
        identityPoolId,
        graphqlEndpoints,
      },
    } = await axios.get(`${window.location.origin}/config.json`)

    const {
      data: { apiEndpointUrl },
    } = await axios.get(`${window.location.origin}/api-config.json`)

    const amplifyConfigs = {
      Auth: {
        mandatorySignIn: true,
        region: region,
        userPoolId,
        identityPoolId,
        userPoolWebClientId,
      },
      Storage: {
        bucket: userDataBucket,
        region,
        identityPoolId,
      },
      API: {
        endpoints: getEndpoints(['jobs'], region, apiEndpointUrl),
      },
      // Appsync configs
      aws_appsync_graphqlEndpoint: graphqlEndpoints.GRAPHQL,
      aws_appsync_region: region,
      aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    }

    console.log('amplifyConfigs', amplifyConfigs)
    Amplify.configure(amplifyConfigs)
    return amplifyConfigs
  } catch (error) {
    console.error('Failed to init Amplify', error)
  }
}
