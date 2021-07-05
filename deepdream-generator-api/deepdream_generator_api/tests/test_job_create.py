import json
from deepdiff import DeepDiff

from deepdream_generator_api.libs import appsync
from deepdream_generator_api.libs.data.deepdream import DeepdreamParams
from deepdream_generator_api.tests.mocks import GqlMockClient


class TestJobCreate:
    def test_job_create_success(self, monkeypatch, job_table, job_queue):
        input_path = '1b74a419-b419-40a4-9fb5-dbf355db2b96-beach.jpg'
        input_name = 'foo.jpg'
        user_id = '123456'
        params = DeepdreamParams().as_dict()
        body = json.dumps({
            'input_path': input_path,
            'input_name': input_name,
            'params': params
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

        expected_job = {
            'user_id': user_id,
            'params': params,
            'input_path': input_path,
            'input_name': input_name,
            'id': '123-456-789',
            'progress': 0
        }

        gql_responses = {
            'CreateJob': {
                'createJob': expected_job
            }
        }

        # Monkey patch appsync client because appsync is not included in the free localstack
        appsync_client = GqlMockClient(responses=gql_responses)
        monkeypatch.setattr(appsync, 'make_appsync_client', lambda: appsync_client)

        # This is little hackish but the lambda handler need to be imported after the monkeypatch
        from deepdream_generator_api.functions.jobs import create

        # When calling create job handler as authenticated user and with correct body
        response = create.main(event, None)

        # Response has status code of 200 and a serialized Job
        assert response['statusCode'] == 200
        job = json.loads(response['body'])

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

        # Correct gql requests are made
        assert dict(appsync_client.recorded_inputs) == {
            'CreateJob': [
                {'input': {
                    'user_id': '123456',
                    'params': params,
                    'input_path': '1b74a419-b419-40a4-9fb5-dbf355db2b96-beach.jpg',
                    'input_name': 'foo.jpg'
                }}
            ]
        }
