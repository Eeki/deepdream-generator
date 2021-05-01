import pytest
from pynamodb.models import PAY_PER_REQUEST_BILLING_MODE

from deepdream_generator_api.models.Job import Job


@pytest.fixture
def job_table():
    if not Job.exists():
        Job.create_table(wait=True, billing_mode=PAY_PER_REQUEST_BILLING_MODE)
    yield None
    Job.delete_table()
