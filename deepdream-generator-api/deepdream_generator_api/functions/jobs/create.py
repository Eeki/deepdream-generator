import os
import json
from deepdream_generator_api.libs.appsync import make_appsync_client
from deepdream_generator_api.libs.aws_resources import get_authorized_user
from deepdream_generator_api.libs.cors import get_cors_headers
from deepdream_generator_api.libs.aws_resources import get_resource
from deepdream_generator_api.libs.graphql.mutations import create_job

sqs = get_resource('sqs')
appsync_client = make_appsync_client()


def main(event, _):
    data = json.loads(event['body'])
    cognito_user = get_authorized_user(event)

    job_queue = sqs.get_queue_by_name(
        QueueName=os.environ.get('JOB_QUEUE_NAME')
    )

    graphql_params = {
        'user_id': cognito_user,
        'params': data['params'],
        'input_path': data['input_path'],
        'input_name': data['input_name'],
    }

    response = appsync_client.execute(
        create_job,
        variable_values=json.dumps({'input': graphql_params})
    )

    job = response['createJob']

    job_queue.send_message(
        MessageBody=json.dumps({
            'user_id': cognito_user,
            'job_id': job['id'],
        })
    )

    response = {
        'statusCode': 200,
        'headers': get_cors_headers(['OPTIONS', 'POST']),
        'body': json.dumps(job)
    }

    return response
