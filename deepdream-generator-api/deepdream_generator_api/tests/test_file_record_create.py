import json
import time
from lambda_local.main import call
from lambda_local.context import Context

from deepdream_generator_api.functions.file_records import create
from deepdream_generator_api.models.FileRecord import FileRecord
from deepdream_generator_api.fixtures.file_record import file_record_table


class TestFileRecordCreat(object):
    def test_create_success(self, file_record_table):
        file_path = '1b74a419-b419-40a4-9fb5-dbf355db2b96-beach.jpg'
        file_name = 'beach.jpg'
        user_id = '123456'
        body = json.dumps({
            'filePath': file_path,
            'fileName': file_name
        })
        event = {
            'requestContext': {
                'authorizer': {
                    'claims': {
                        'cognito:username': user_id
                    }
                }
            },
            'body': body

        }
        context = Context(54000)

        # When calling create file record handler as authenticated user and with correct body
        response = call(create.main, event, context)

        # Response has status code of 200 and a serialized FileRecord
        assert response[0]['statusCode'] == 200
        response_body = json.loads(response[0]['body'])
        assert response_body['userId'] == user_id
        assert response_body['filePath'] == file_path
        assert response_body['fileName'] == file_name
        assert response_body['createdAt'] < time.time()

        # Only one FileRecord is created
        assert FileRecord.count() == 1

        # Created FileRecord is also in the db
        file_record = FileRecord.get(hash_key=user_id, range_key=file_path)
        assert file_record.userId == user_id
        assert file_record.filePath == file_path
        assert file_record.fileName == file_name
        assert file_record.createdAt < time.time()
