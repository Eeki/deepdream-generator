import json
from lambda_local.main import call
from lambda_local.context import Context

from deepdream_generator_api.functions.file_records import list


class TestFileRecordList(object):
    def test_list_success(self, file_record_table, create_file_records):
        user_id = '123456'
        file_records = create_file_records([
            {'user_id': user_id, 'file_path': 'abc-image1.jpg', 'file_name': 'image1.jpg'},
            {'user_id': user_id, 'file_path': 'def-image2.jpg', 'file_name': 'image2.jpg'},
            {'user_id': 'another_user', 'file_path': 'abc-image1.jpg', 'file_name': 'image1.jpg'},
        ])
        event = {
            'requestContext': {
                'authorizer': {
                    'claims': {
                        'cognito:username': user_id
                    }
                }
            },
        }
        context = Context(54000)

        # When calling list file record handler as authenticated user
        response = call(list.main, event, context)

        # Response has status code of 200 and body contain FileRecords for the user
        assert response[0]['statusCode'] == 200
        response_body = json.loads(response[0]['body'])
        assert len(response_body) == 2
        assert response_body[0] == file_records[0].to_dict()
        assert response_body[1] == file_records[1].to_dict()
