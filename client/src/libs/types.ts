export interface FileRecord {
  file_path: string
  file_name: string
  created_at?: number
  mime_type?: string
}

export interface Job {
  id: string
  input_path: string
  input_name: string
  result_path: string
  progress: number
  started_at: number
}

interface UserAttributes {
  email: string
  email_vertified: boolean
  sub: string
}

export interface UserInfo {
  id: string
  username: string
  attributes: UserAttributes
}

export interface ApiEndpoint {
  name: string
  endpoint: string
  region: string
  custom_header: () => Promise<Record<string, string>>
}

export interface AmplifyConfigs {
  Auth: {
    mandatorySignIn: boolean
    region: string
    userPoolId: string
    identityPoolId: string
    userPoolWebClientId: string
  }
  Storage: {
    bucket: string
    region: string
    identityPoolId: string
  }
  API: {
    endpoints: ApiEndpoint[]
  }
  // Appsync configs
  aws_appsync_graphqlEndpoint: string
  aws_appsync_region: string
  aws_appsync_authenticationType: string
}
