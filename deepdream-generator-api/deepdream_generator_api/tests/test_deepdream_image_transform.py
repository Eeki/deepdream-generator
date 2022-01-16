import os
import json
import uuid
import time
from pathlib import Path

from deepdream_generator_api.libs.aws_resources import get_resource, get_users_private_file_path
from deepdream_generator_api.libs.data.deepdream import DeepdreamParams
from deepdream_generator_api.tests.fixtures.s3 import S3FileUploadItem
from deepdream_generator_api.models.Job import Job
from deepdream_generator_api.libs import appsync
from deepdream_generator_api.tests.mocks import GqlMockClient
from deepdream_generator_api.tests.test_data.gql_requests import request_inputs1

s3 = get_resource('s3')
sqs = get_resource('sqs')

constant_uuid = uuid.UUID('123e4567-e89b-12d3-a456-426655440000')


def patch_uuid():
    return constant_uuid


def patch_time():
    return 1000000000


# TODO mockeypatch the deepdream function to just return some image.
# This test should not test the actual deepdream algorithm

class TestDeepdreamImageTransform(object):
    def test_image_transform(
            self,
            monkeypatch,
            create_s3_bucket,
            create_s3_files,
            job_table,
            file_record_table,
            job_queue
    ):
        user_id = '123-user-abc'
        user_file_bucket_id = os.environ.get('S3_FILE_BUCKET_ID')
        s3_file_name = 'abc-image1.jpg'
        s3_file_path = get_users_private_file_path(
            user_id=user_id,
            file_name=s3_file_name
        )

        image_path = Path(__file__).parent / "test_data/dog1.jpg"
        job_id = 'job-123'

        bucket = create_s3_bucket(user_file_bucket_id)
        create_s3_files(
            bucket_name=bucket.name,
            s3_file_upload_items=[
                S3FileUploadItem(s3_file_path, local_file_path=image_path)
            ]
        )

        os.environ['SQS_JOB_QUEUE_URL'] = job_queue.url

        job = Job(
            id=job_id,
            user_id=user_id,
            input_path=s3_file_path,
            input_name=s3_file_name,
            params=json.dumps(DeepdreamParams(num_iterations=2).as_dict())
        )

        job.save()

        body = json.dumps({
            'user_id': job.user_id,
            'job_id': job.id,
        })

        event = {
            "Records": [
                {
                    "messageId": "1224bd6e-c13d-4c06-b977-1cf54eddfafc",
                    "receiptHandle": "ABC",
                    "body": body,
                    "attributes": {
                        "ApproximateReceiveCount": "1",
                        "SentTimestamp": "1619898591718",
                        "SenderId": "AROAABB:deepdream-generator-api-dev-job-create",
                        "ApproximateFirstReceiveTimestamp": "1619898591726"
                    },
                    "messageAttributes": {},
                    "md5OfBody": "abcd",
                    "eventSource": "aws:sqs",
                    "eventSourceARN": "arn:aws:sqs:eu-north-1:123:job-queue",
                    "awsRegion": "eu-north-1"
                }
            ]
        }

        gql_responses = {
            'GetJob': {
                'getJob': job.to_dict()
            },
        }

        transformed_file_path = f'private/{user_id}/{constant_uuid}-{s3_file_name}'

        # Monkey patch uuid package so that function uuid.uuid4() will return always the same uuid
        monkeypatch.setattr(uuid, 'uuid4', patch_uuid)

        # Monkey patch time package so that function time.time() will return always the same timestamp
        monkeypatch.setattr(time, 'time', patch_time)

        # Monkey patch appsync client because appsync is not included in the free localstack
        appsync_client = GqlMockClient(responses=gql_responses)
        monkeypatch.setattr(appsync, 'make_appsync_client', lambda: appsync_client)

        # The lambda handler need to be imported after the monkey-patching is finished
        from deepdream_generator_api.functions.deepdream import deepdream_image_transform

        # When calling lambda with sqs message event
        response = deepdream_image_transform.main(event, None)

        # Response is ok
        assert response['statusCode'] == 200
        # And correct qgl requests are made
        assert dict(appsync_client.recorded_inputs) == request_inputs1

        # Result file is created to s3
        s3.Object(user_file_bucket_id, transformed_file_path).load()
