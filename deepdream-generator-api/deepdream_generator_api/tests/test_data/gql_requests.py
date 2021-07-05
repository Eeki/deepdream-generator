request_inputs1 = {
  'UpdateJob': [
    {'input': {'user_id': '123-user-abc', 'id': 'job-123', 'started_at':  1000000000000}},
    {'input': {'user_id': '123-user-abc', 'id': 'job-123', 'progress': 0.2}},
    {'input': {'user_id': '123-user-abc', 'id': 'job-123', 'progress': 0.4}},
    {'input': {'user_id': '123-user-abc', 'id': 'job-123', 'progress': 0.6}},
    {'input': {'user_id': '123-user-abc', 'id': 'job-123', 'progress': 0.8}},
    {'input': {
      'user_id': '123-user-abc',
      'id': 'job-123',
      'result_path': 'private/123-user-abc/123e4567-e89b-12d3-a456-426655440000-abc-image1.jpg',
      'progress': 1
    }}
  ],
  'GetJob': [{'user_id': '123-user-abc', 'id': 'job-123'}],
  'CreateFileFileRecord': [
    {'input': {
      'user_id': '123-user-abc',
      'file_path': 'private/123-user-abc/123e4567-e89b-12d3-a456-426655440000-abc-image1.jpg',
      'file_name': 'abc-image1.jpg',
      'type': 'RESULT'
    }}
  ]
}
