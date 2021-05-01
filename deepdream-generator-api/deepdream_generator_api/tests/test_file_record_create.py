import json
import time
from deepdiff import DeepDiff
from lambda_local.main import call
from lambda_local.context import Context

from deepdream_generator_api.functions.file_records import create
from deepdream_generator_api.models.FileRecord import FileRecord

constant_time = time.time()


def patch_time():
    return constant_time


class TestFileRecordCreat(object):
    def test_create_success(self, monkeypatch, file_record_table):
        file_path = '1b74a419-b419-40a4-9fb5-dbf355db2b96-beach.jpg'
        file_name = 'beach.jpg'
        user_id = '123456'
        body = json.dumps({
            'file_path': file_path,
            'file_name': file_name
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

        # Monkey patch time package so that function time.time() will return always the same time
        monkeypatch.setattr(time, 'time', patch_time)

        # When calling create file record handler as authenticated user and with correct body
        response = call(create.main, event, context)

        expected_file_record = {
            'user_id': user_id,
            'file_path': file_path,
            'file_name': file_name,
            'created_at': constant_time
        }

        # Response has status code of 200 and a serialized FileRecord
        assert response[0]['statusCode'] == 200
        file_record = json.loads(response[0]['body'])

        # Serialized FileRecord is as expected
        assert not DeepDiff(expected_file_record, file_record, ignore_order=True)

        # Only one FileRecord is created
        assert FileRecord.count() == 1

        # Created FileRecord can be found in the db
        file_record = FileRecord.get(hash_key=user_id, range_key=file_path)

        # FileRecord from db is as expected
        assert not DeepDiff(expected_file_record, file_record.to_dict(), ignore_order=True)
