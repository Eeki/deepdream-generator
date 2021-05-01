import { Amplify, Auth } from 'aws-amplify'

import {
  SNOWPACK_PUBLIC_AWS_REGION,
  SNOWPACK_PUBLIC_CLIENT_DATA_BUCKET,
  SNOWPACK_PUBLIC_USER_POOL_ID,
  SNOWPACK_PUBLIC_APP_CLIENT_ID,
  SNOWPACK_PUBLIC_IDENTITY_POOL_ID,
  SNOWPACK_PUBLIC_API_ENDPOINT,
} from '@libs/configsLib'

const getEndpoints = (endpoints: string[]): Record<string, any> =>
  endpoints.map(endpoint => ({
    name: endpoint,
    endpoint: SNOWPACK_PUBLIC_API_ENDPOINT,
    region: SNOWPACK_PUBLIC_AWS_REGION,
    custom_header: async () => ({
      Authorization: `Bearer ${(await Auth.currentSession())
        .getIdToken()
        .getJwtToken()}`,
    }),
  }))

const appSyncConfigs = {
  aws_appsync_graphqlEndpoint:
    'https://dzc2p63gfbfzvivgqdpgzzq7pm.appsync-api.eu-north-1.amazonaws.com/graphql',
  aws_appsync_region: SNOWPACK_PUBLIC_AWS_REGION,
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
}

export const setupAmplify = (): void => {
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
      endpoints: getEndpoints(['files', 'jobs']),
    },
    ...appSyncConfigs,
  })
}
