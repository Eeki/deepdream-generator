import json
from deepdream_generator_api.models.Job import Job
from deepdream_generator_api.libs.aws_resources import get_authorized_user
from deepdream_generator_api.libs.cors import get_cors_headers


def main(event, context):
    cognito_user = get_authorized_user(event)
    jobs = Job.query(hash_key=cognito_user)

    response = {
        'statusCode': 200,
        # TODO set the CORS headers in the API gateway
        'headers': get_cors_headers(['OPTIONS', 'GET']),
        'body': json.dumps(
            [job.to_dict() for job in jobs]
        )
    }

    return response
