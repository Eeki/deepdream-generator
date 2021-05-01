export const ListUserFileRecords = `
  query ListUserFileRecords {
    listUserFiles {
      items {
        user_id
        file_path
        file_name
        created_at
      }
    }
  }
`

export const ListUserJobs = `
  query ListUserJobs {
    listUserJobs {
      items {
        id
        input_name
        input_path
        progress
        result_path
        started_at
      }
    }
  }
`
