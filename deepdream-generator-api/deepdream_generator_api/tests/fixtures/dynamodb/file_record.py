import pytest
import time
from pynamodb.models import PAY_PER_REQUEST_BILLING_MODE

from deepdream_generator_api.models.FileRecord import FileRecord


@pytest.fixture
def file_record_table():
    if not FileRecord.exists():
        FileRecord.create_table(wait=True, billing_mode=PAY_PER_REQUEST_BILLING_MODE)
    yield None
    FileRecord.delete_table()


def file_records_factory(file_records_props):
    with FileRecord.batch_write() as batch:
        file_records = [FileRecord(
            user_id=file_record_props.get('user_id'),
            file_path=file_record_props.get('file_path'),
            file_name=file_record_props.get('file_name'),
            created_at=time.time()
        ) for file_record_props in file_records_props]
        for file_record in file_records:
            batch.save(file_record)
        return file_records


@pytest.fixture
def create_file_records(file_record_table):
    return file_records_factory
