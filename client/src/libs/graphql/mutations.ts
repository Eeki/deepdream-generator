export const CreateOwnFileFileRecord = `
  mutation CreateOwnFileFileRecord(
  $input: CreateFileInput!
  ) {
  createOwnFile(input: $input) {
    created_at
    file_name
    file_path
    user_id
  }
}
`
