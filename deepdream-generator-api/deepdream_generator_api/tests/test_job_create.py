import json
from deepdiff import DeepDiff
from lambda_local.main import call
from lambda_local.context import Context

from deepdream_generator_api.libs import appsync
from deepdream_generator_api.tests.mocks import mock_gql_client


class TestJobCreate:
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

        expected_job = {
            'user_id': user_id,
            'input_path': input_path,
            'input_name': input_name,
            'id': '123-456-789',
            'progress': 0
        }

        expected_qgl_result = {
            'createJob': expected_job
        }

        # Monkey patch appsync client because appsync is not included in the free localstack
        monkeypatch.setattr(appsync, 'make_appsync_client', mock_gql_client(expected_qgl_result))

        # This is little hackish but create job lambda need to be imported after the monkeypatch
        from deepdream_generator_api.functions.jobs import create

        # When calling create job handler as authenticated user and with correct body
        response = call(create.main, event, context)

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
