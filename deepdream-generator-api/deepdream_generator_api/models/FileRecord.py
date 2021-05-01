import os
from pynamodb.attributes import UnicodeAttribute, NumberAttribute

from deepdream_generator_api.models.BaseModel import BaseModel


class FileRecord(BaseModel):
    class Meta:
        table_name = os.environ.get('FILE_TABLE_NAME')
        region = os.environ.get('AWS_REGION')  # TODO is the region necessary here
        if os.environ.get('DYNAMODB_ENDPOINT_URL'):
            host = os.environ.get('DYNAMODB_ENDPOINT_URL')
    user_id = UnicodeAttribute(hash_key=True)
    file_path = UnicodeAttribute(range_key=True)
    file_name = UnicodeAttribute()
    created_at = NumberAttribute()
