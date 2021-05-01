from typing import List, Union
from pathlib import Path
import pytest
from dataclasses import dataclass, field

from deepdream_generator_api.libs.aws_resources import get_resource


s3 = get_resource('s3')


@dataclass
class S3FileUploadItem:
    s3_file_path: str
    local_file_path: Union[str, Path]
    _local_file_path: str = field(init=False, repr=False)

    @property
    def local_file_path(self) -> str:
        return self._local_file_path

    @local_file_path.setter
    def local_file_path(self, local_file_path: Union[str, Path]) -> None:
        self._local_file_path = str(local_file_path)


@pytest.fixture
def create_s3_bucket():
    created_buckets = []

    def s3_bucket_factory(bucket_name):
        created_bucket = s3.create_bucket(Bucket=bucket_name)
        created_buckets.append(created_bucket)
        return created_bucket

    yield s3_bucket_factory

    for bucket in created_buckets:
        for item in bucket.objects.all():
            item.delete()
        bucket.delete()


@pytest.fixture
def create_s3_files():
    def s3_file_factory(bucket_name: str, s3_file_upload_items: List[S3FileUploadItem]):
        for upload_item in s3_file_upload_items:
            s3.Object(bucket_name, upload_item.s3_file_path).put(
                Body=open(upload_item.local_file_path, 'rb')
            )
    return s3_file_factory
