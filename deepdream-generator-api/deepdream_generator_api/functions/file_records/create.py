import json
import time
from deepdream_generator_api.models.FileRecord import FileRecord
from deepdream_generator_api.libs.aws_resources import get_authorized_user


def main(event, context):
    data = json.loads(event['body'])
    cognito_user = get_authorized_user(event)
    timestamp = time.time()

    file_record = FileRecord(
        userId=cognito_user,
        filePath=data.get('filePath'),
        fileName=data.get('fileName'),
        createdAt=timestamp
    )

    file_record.save()

    response = {
        "statusCode": 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST'
        },
        "body": file_record.to_json()
    }

    return response
