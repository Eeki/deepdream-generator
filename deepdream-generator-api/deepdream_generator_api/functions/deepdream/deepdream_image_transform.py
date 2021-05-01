import io
import os
import time
import json
from PIL import Image

from deepdream_generator_api.libs.aws_resources import (
    get_resource,
    s3_read_file,
    s3_write_private_file
)
from deepdream_generator_api.models.Job import Job
from deepdream_generator_api.models.FileRecord import FileRecord

s3 = get_resource('s3')


def main(event, context):
    user_data_bucket = os.environ.get('S3_FILE_BUCKET_ID')
    data = json.loads(event['body'])
    user_id = data['user_id']
    job_id = data['job_id']

    jobs = list(Job.query(user_id, Job.id == job_id))

    if len(jobs) < 1:
        return {'statusCode': 404}

    job = jobs[0]

    read_stream = s3_read_file(s3, user_data_bucket, job.input_path)

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
        file_name=job.input_name,
        user_id=user_id,
        buffer=write_stream
    )

    file_record = FileRecord(
        user_id=user_id,
        file_path=transformed_file_path,
        file_name=job.input_name,
        created_at=time.time()
    )
    file_record.save()

    job.progress = 1
    job.result_path = transformed_file_path
    job.save()

    return {'statusCode': 200}
