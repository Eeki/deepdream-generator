import os
import json
import uuid
from deepdream_generator_api.models.Job import Job
from deepdream_generator_api.libs.aws_resources import get_authorized_user
from deepdream_generator_api.libs.cors import get_cors_headers
from deepdream_generator_api.libs.aws_resources import get_resource

sqs = get_resource('sqs')


def main(event, context):
    data = json.loads(event['body'])
    cognito_user = get_authorized_user(event)

    job_queue = sqs.get_queue_by_name(
        QueueName=os.environ.get('JOB_QUEUE_NAME')
    )

    job = Job(
        id=str(uuid.uuid4()),
        user_id=cognito_user,
        input_path=data.get('input_path'),
        input_name=data.get('input_name')
    )

    job.save()

    job_queue.send_message(
        MessageBody=json.dumps({
            'user_id': cognito_user,
            'job_id': job.id,
        })
    )

    response = {
        "statusCode": 200,
        'headers': get_cors_headers(['OPTIONS', 'POST']),
        "body": job.to_json()
    }

    return response
