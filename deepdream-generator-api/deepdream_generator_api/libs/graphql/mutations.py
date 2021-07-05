from gql import gql

create_job = gql(
    """
    mutation CreateJob($input: CreateJobInput!) {
      createJob(input: $input) {
        id
        user_id
        params
        input_path
        input_name
        progress
        result_path
        started_at
      }
    }
"""
)

update_job = gql(
    """
    mutation UpdateJob($input: UpdateJobInput!) {
      updateJob(input: $input) {
        id
        user_id
        params
        input_path
        input_name
        progress
        result_path
        started_at
      }
    }
"""
)

create_file_record = gql(
    """
    mutation CreateFileFileRecord($input: CreateFileInput!) {
      createFile(input: $input) {
        user_id
        file_name
        file_path
        created_at
        type
      }
    }
"""
)
