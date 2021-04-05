FROM public.ecr.aws/lambda/python:3.8

COPY ./functions/file_records/requirements.txt ${LAMBDA_TASK_ROOT}/requirements.txt
WORKDIR ${LAMBDA_TASK_ROOT}
RUN pip install -r requirements.txt

COPY ./functions/file_records/*.py ${LAMBDA_TASK_ROOT}/deepdream_generator_api/functions/file_records/
COPY ./libs/*.py ${LAMBDA_TASK_ROOT}/deepdream_generator_api/libs/
COPY ./models/*.py ${LAMBDA_TASK_ROOT}/deepdream_generator_api/models/
