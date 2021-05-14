export const onCreateJob = `
  subscription OnCreateJob($user_id: String!) {
    onCreateJob(user_id: $user_id) {
      id
      user_id
      input_path
      input_name
      result_path
      progress
      started_at
    }
  }
`

export const onUpdateJob = `
  subscription OnUpdateJob($user_id: String!) {
    onUpdateJob(user_id: $user_id) {
      id
      user_id
      input_path
      input_name
      result_path
      progress
      started_at     
    }
  }
`

export const onCreateFile = `
  subscription OnCreateFile($user_id: String!) {
    onCreateFile(user_id: $user_id) {
    user_id
    file_name
    file_path
    created_at     
    }
  }
`
