export const CreateFileFileRecord = `
  mutation CreateFileFileRecord(
  $input: CreateFileInput!
  ) {
  createFile(input: $input) {
    created_at
    file_name
    file_path
    user_id
  }
}
`
