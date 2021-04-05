import pytest
import time
from pynamodb.models import PAY_PER_REQUEST_BILLING_MODE

from deepdream_generator_api.models.FileRecord import FileRecord


def create_file_record_table():
    return FileRecord.create_table(wait=True, billing_mode=PAY_PER_REQUEST_BILLING_MODE)


@pytest.fixture
def file_record_table():
    if not FileRecord.exists():
        create_file_record_table()
    yield None
    FileRecord.delete_table()


@pytest.fixture
def create_file_records():
    def file_records_factory(file_records_props):
        with FileRecord.batch_write() as batch:
            file_records = [FileRecord(
                userId=file_record_props.get('userId'),
                filePath=file_record_props.get('filePath'),
                fileName=file_record_props.get('fileName'),
                createdAt=time.time()
            ) for file_record_props in file_records_props]
            for file_record in file_records:
                batch.save(file_record)
            return file_records
    return file_records_factory
