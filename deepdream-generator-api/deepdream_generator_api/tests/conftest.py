# Import all fixtures to conftest.py to have them available in tests automatically

from deepdream_generator_api.tests.fixtures.dynamodb.file_record import *
from deepdream_generator_api.tests.fixtures.dynamodb.job import *
from deepdream_generator_api.tests.fixtures.s3 import *
from deepdream_generator_api.tests.fixtures.sqs import *
