import os
import io
import boto3
import uuid

resource_env_kwargs_mapping = {
    's3': {'endpoint_url': 'S3_ENDPOINT_URL'},
    'dynamodb': {'endpoint_url': 'DYNAMODB_ENDPOINT_URL'},
    'sqs': {'endpoint_url': 'SQS_ENDPOINT_URL'}
}


def get_env_kwargs(env_kwargs: dict):
    kwargs = {}
    for [key, env_name] in env_kwargs.items():
        env_value = os.getenv(env_name)
        if env_value:
            kwargs[key] = env_value
    return kwargs


def get_resource(resource_name: str, **kwargs):
    resource_env_kwargs = resource_env_kwargs_mapping.get(resource_name, {})
    env_kwargs = get_env_kwargs(resource_env_kwargs)
    return boto3.resource(resource_name, **env_kwargs, **kwargs)


def get_authorized_user(event):
    return event.get('requestContext', {}).get('authorizer', {}).get('claims', {}).get('cognito:username', None)


def s3_read_file(s3_resource, bucket_name: str, file_path: str) -> io.BytesIO:
    bucket = s3_resource.Bucket(bucket_name)
    file_obj = bucket.Object(file_path)

    buffer = io.BytesIO()
    file_obj.download_fileobj(buffer)
    return buffer


def get_users_private_file_path(user_id: str, file_name: str):
    return f"private/{os.environ.get('AWS_REGION')}:{user_id}/{file_name}"


def s3_write_private_file(
        s3_resource,
        bucket_name: str,
        file_name: str,
        user_id: str,
        buffer: io.BytesIO,
        random_prefix=True
) -> str:
    s3_file_name = f"{uuid.uuid4()}-{file_name}" if random_prefix else file_name
    s3_file_path = get_users_private_file_path(user_id, s3_file_name)
    s3_resource.Object(bucket_name, s3_file_path).put(
        Body=buffer
    )
    return s3_file_path
