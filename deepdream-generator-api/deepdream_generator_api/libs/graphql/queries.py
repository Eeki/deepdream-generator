from gql import gql

get_job = gql(
    """
    query GetJob($user_id: String!, $id: String!) {
      getJob(user_id: $user_id, id: $id) {
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
