import os

from boto3 import Session as AWSSession
from requests_aws4auth import AWS4Auth

from gql.client import Client
from gql.transport.requests import RequestsHTTPTransport


def make_appsync_client():
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }

    session = AWSSession()
    credentials = session.get_credentials().get_frozen_credentials()

    auth = AWS4Auth(
        credentials.access_key,
        credentials.secret_key,
        session.region_name,
        'appsync',
        session_token=credentials.token,
    )

    transport = RequestsHTTPTransport(
        url=os.getenv('APPSYNC_ENDPOINT'),
        headers=headers,
        auth=auth
    )
    client = Client(
        transport=transport,
        fetch_schema_from_transport=True
    )
    return client
