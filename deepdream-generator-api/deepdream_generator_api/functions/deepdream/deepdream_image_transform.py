import io
import os
import json
from time import time
from PIL import Image

from deepdream_generator_api.libs.aws_resources import (
    get_resource,
    s3_read_file,
    s3_write_private_file
)
from deepdream_generator_api.libs.appsync import make_appsync_client
from deepdream_generator_api.libs.graphql.queries import get_job
from deepdream_generator_api.libs.graphql.mutations import update_job, create_file_record
from deepdream_generator_api.libs.deepdream.deepdream import make_deepdream_image
from deepdream_generator_api.libs.helpers import SetInterval
from deepdream_generator_api.libs.data.deepdream import DeepdreamParams

s3 = get_resource('s3')
sqs = get_resource('sqs')
appsync_client = make_appsync_client()


def graphql_update_job(job_input):
    appsync_client.execute(
        update_job,
        variable_values=json.dumps({'input': job_input})
    )


def increase_message_visibility(message):
    def _increase_message_visibility():
        message.change_visibility(
            VisibilityTimeout=120
        )
    return _increase_message_visibility


def progress_callback(user_id, job_id, num_repeats):
    def _progress_callback(repeat):
        progress = repeat / (num_repeats + 1)
        if progress:
            graphql_update_job({
                'user_id': user_id,
                'id': job_id,
                'progress': progress
            })
    return _progress_callback


def main(event, _):

    user_data_bucket = os.environ.get('S3_FILE_BUCKET_ID')
    job_queue_url = os.environ.get('SQS_JOB_QUEUE_URL')

    # Each lambda should process only one message from queue
    record = event['Records'][0]
    data = json.loads(record['body'])
    user_id = data.get('user_id')
    job_id = data.get('job_id')

    # Set the job as started
    graphql_update_job({
        'user_id': user_id,
        'id': job_id,
        'started_at': int(time() * 1000)  # unix time stamp in milliseconds
    })

    message = sqs.Message(job_queue_url, record['receiptHandle'])

    # As long as the lambda is running the sqs message visibility is increased
    interval = SetInterval(60, increase_message_visibility(message))

    response = appsync_client.execute(
        get_job,
        variable_values=json.dumps({'user_id': user_id, 'id': job_id})
    )

    job = response['getJob']

    read_stream = s3_read_file(s3, user_data_bucket, job['input_path'])

    try:
        params_obj = json.loads(job.get('params'))
    except:
        params_obj = {}

    params = DeepdreamParams(**params_obj)

    # It can be that we don't need the PIL.Image here
    img = Image.open(read_stream)
    deepdream_image = make_deepdream_image(
        img,
        params=params,
        progress_callback=progress_callback(user_id, job_id, params.num_repeats),
    )
    img_format = img.format

    write_stream = io.BytesIO()
    deepdream_image.save(write_stream, img_format)
    write_stream.seek(0)

    transformed_file_path = s3_write_private_file(
        s3_resource=s3,
        bucket_name=user_data_bucket,
        file_name=job['input_name'],
        user_id=user_id,
        buffer=write_stream
    )

    graphql_update_job({
        'user_id': user_id,
        'id': job_id,
        'result_path': transformed_file_path,
        'progress': 1
    })

    create_file_record_input = {
        'user_id': user_id,
        'file_path': transformed_file_path,
        'file_name': job['input_name'],
        'type': 'RESULT'
    }

    appsync_client.execute(
        create_file_record,
        variable_values=json.dumps({'input': create_file_record_input})
    )

    interval.cancel()

    return {'statusCode': 200}
