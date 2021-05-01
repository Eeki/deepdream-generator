import os
from pynamodb.indexes import LocalSecondaryIndex, AllProjection
from pynamodb.attributes import UnicodeAttribute, NumberAttribute

from deepdream_generator_api.models.BaseModel import BaseModel


class InputPathIndex(LocalSecondaryIndex):
    class Meta:
        projection = AllProjection()
    user_id = UnicodeAttribute(hash_key=True)
    input_path = UnicodeAttribute(range_key=True)


class Job(BaseModel):
    class Meta:
        table_name = os.environ.get('JOB_TABLE_NAME')
        region = os.environ.get('AWS_REGION')
        if os.environ.get('DYNAMODB_ENDPOINT_URL'):
            host = os.environ.get('DYNAMODB_ENDPOINT_URL')
    user_id = UnicodeAttribute(hash_key=True)
    id = UnicodeAttribute(range_key=True)
    input_path_index = InputPathIndex()
    input_path = UnicodeAttribute()
    input_name = UnicodeAttribute()
    result_path = UnicodeAttribute(null=True)
    progress = NumberAttribute(default=0)
    started_at = NumberAttribute(null=True)
