import json
import time
from deepdream_generator_api.models.FileRecord import FileRecord
from deepdream_generator_api.libs.aws_resources import get_authorized_user
from deepdream_generator_api.libs.cors import get_cors_headers


def main(event, context):
    data = json.loads(event['body'])
    user_id = get_authorized_user(event)

    file_record = FileRecord(
        user_id=user_id,
        file_path=data.get('file_path'),
        file_name=data.get('file_name'),
        created_at=time.time()
    )

    file_record.save()

    response = {
        "statusCode": 200,
        'headers': get_cors_headers(['OPTIONS', 'POST']),
        "body": file_record.to_json()
    }

    return response
