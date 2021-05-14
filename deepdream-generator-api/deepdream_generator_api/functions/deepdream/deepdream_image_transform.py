import io
import os
import json
from PIL import Image

from deepdream_generator_api.libs.aws_resources import (
    get_resource,
    s3_read_file,
    s3_write_private_file
)
from deepdream_generator_api.libs.appsync import make_appsync_client
from deepdream_generator_api.libs.graphql.queries import get_job
from deepdream_generator_api.libs.graphql.mutations import update_job, create_file_record


s3 = get_resource('s3')
appsync_client = make_appsync_client()


def main(event, context):
    user_data_bucket = os.environ.get('S3_FILE_BUCKET_ID')
    # Each lambda should process only one message from queue
    record = event['Records'][0]
    data = json.loads(record['body'])
    user_id = data.get('user_id')
    job_id = data.get('job_id')

    response = appsync_client.execute(
        get_job,
        variable_values=json.dumps({'user_id': user_id, 'id': job_id})
    )

    job = response['getJob']

    read_stream = s3_read_file(s3, user_data_bucket, job['input_path'])

    # It can be that we don't need the PIL.Image here
    img = Image.open(read_stream)
    img_format = img.format
    img = img.convert('L')  # Convert to black and white image
    # img.show()  # this will show the image in a pop up window.

    write_stream = io.BytesIO()
    img.save(write_stream, img_format)
    write_stream.seek(0)

    transformed_file_path = s3_write_private_file(
        s3_resource=s3,
        bucket_name=user_data_bucket,
        file_name=job['input_name'],
        user_id=user_id,
        buffer=write_stream
    )

    update_job_input = {
        'user_id': user_id,
        'id': job_id,
        'result_path': transformed_file_path,
        'progress': 1
    }

    appsync_client.execute(
        update_job,
        variable_values=json.dumps({'input': update_job_input})
    )

    create_file_record_input = {
        'user_id': user_id,
        'file_path': transformed_file_path,
        'file_name': job['input_name'],
    }

    appsync_client.execute(
        create_file_record,
        variable_values=json.dumps({'input': create_file_record_input})
    )

    return {'statusCode': 200}
