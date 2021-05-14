import os
import json
from pathlib import Path
from lambda_local.main import call
from lambda_local.context import Context

from deepdream_generator_api.functions.deepdream import deepdream_image_transform
from deepdream_generator_api.libs.aws_resources import get_resource, get_users_private_file_path
from deepdream_generator_api.tests.fixtures.s3 import S3FileUploadItem
from deepdream_generator_api.models.Job import Job
from deepdream_generator_api.models.FileRecord import FileRecord

s3 = get_resource('s3')
sqs = get_resource('sqs')


# TODO fix and monkeypatch this test
class TestDeepdreamImageTransform(object):
    def test_image_transform(self, create_s3_bucket, create_s3_files, job_table, file_record_table):
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

        job = Job(
            id=job_id,
            user_id=user_id,
            input_path=s3_file_path,
            input_name=s3_file_name
        )

        job.save()

        body = json.dumps({
            'user_id': job.user_id,
            'job_id': job.id,
        })

        sqs_message_event = {
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

        context = Context(54000)

        # When calling lambda with sqs message event
        response = call(deepdream_image_transform.main, sqs_message_event, context)[0]
        assert response['statusCode'] == 200

        # Job is completed and has result path
        job.refresh(consistent_read=True)
        assert job.progress == 1
        assert job.result_path

        # new FileRecord is created for the result file
        result_file_records = list(FileRecord.query(user_id, FileRecord.file_path == job.result_path))
        assert len(result_file_records) == 1
        assert result_file_records[0].file_path == job.result_path
        assert result_file_records[0].file_name == job.input_name == s3_file_name
        assert result_file_records[0].user_id == job.user_id == user_id

        # and result file is created to s3
        s3.Object(user_file_bucket_id, job.result_path).load()

