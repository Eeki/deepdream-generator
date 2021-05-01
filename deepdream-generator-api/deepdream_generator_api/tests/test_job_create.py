import json
import uuid
from deepdiff import DeepDiff
from lambda_local.main import call
from lambda_local.context import Context

from deepdream_generator_api.functions.jobs import create

constant_uuid = uuid.UUID('123e4567-e89b-12d3-a456-426655440000')


def patch_uuid():
    return constant_uuid


class TestJobCreate(object):
    def test_job_create_success(self, monkeypatch, job_table, job_queue):
        input_path = '1b74a419-b419-40a4-9fb5-dbf355db2b96-beach.jpg'
        input_name = 'foo.jpg'
        user_id = '123456'
        body = json.dumps({
            'input_path': input_path,
            'input_name': input_name
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

        # Monkey patch uuid package so that function uuid.uuid4() will return always the same uuid
        monkeypatch.setattr(uuid, 'uuid4', patch_uuid)

        # When calling run job handler as authenticated user and with correct body
        response = call(create.main, event, context)

        expected_job = {
            'user_id': user_id,
            'input_path': input_path,
            'input_name': input_name,
            'id': str(constant_uuid),
            'progress': 0
        }

        # Response has status code of 200 and a serialized Job
        assert response[0]['statusCode'] == 200
        job = json.loads(response[0]['body'])

        # Serialized Job is as expected
        assert not DeepDiff(expected_job, job, ignore_order=True)

        expected_message = {
            'user_id': user_id,
            'job_id': job['id']
        }

        # New message is created to the job queue
        messages = [message for message in job_queue.receive_messages()]
        assert len(messages) == 1

        # Message from job queue is as expected
        message = json.loads(messages[0].body)
        assert not DeepDiff(expected_message, message, ignore_order=True)
