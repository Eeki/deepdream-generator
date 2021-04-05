import os
import boto3

resource_env_kwargs_mapping = {
    's3': {'endpoint_url': 'S3_ENDPOINT_URL'},
    'dynamodb': {'endpoint_url': 'DYNAMODB_ENDPOINT_URL'}
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
