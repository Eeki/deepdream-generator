import json
from deepdream_generator_api.models.FileRecord import FileRecord
from deepdream_generator_api.libs.aws_resources import get_authorized_user


def main(event, context):
    cognito_user = get_authorized_user(event)
    file_records = FileRecord.query(hash_key=cognito_user)

    response = {
        'statusCode': 200,
        # TODO set the CORS headers in the API gateway
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, GET'
        },
        'body': json.dumps(
            [file_record.to_dict() for file_record in file_records]
        )
    }

    return response
