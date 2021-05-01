import os
import pytest

from deepdream_generator_api.libs.aws_resources import get_resource

sqs = get_resource('sqs')


@pytest.fixture
def job_queue():
    queue = sqs.create_queue(
        QueueName=os.environ.get('JOB_QUEUE_NAME')
    )
    yield queue
    queue.delete()
