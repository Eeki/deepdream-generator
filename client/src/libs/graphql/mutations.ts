export const CreateOwnFileFileRecord = `
  mutation CreateOwnFileFileRecord(
    $input: CreateFileInput!
  ) {
    createOwnFile(input: $input) {
      created_at
      file_name
      file_path
      user_id
      type
    }
  }
`

export const DeleteOwnFileRecord = `
  mutation DeleteOwnFileRecord(
    $file_path: String!
  ) {
    deleteOwnFile(file_path: $file_path) {
      file_path
    }
  }
`
