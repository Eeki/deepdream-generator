FROM public.ecr.aws/lambda/python:3.8

COPY ./functions/deepdream/requirements.txt ${LAMBDA_TASK_ROOT}/requirements.txt
WORKDIR ${LAMBDA_TASK_ROOT}
RUN pip install -r requirements.txt

COPY ./functions/deepdream/*.py ${LAMBDA_TASK_ROOT}/deepdream_generator_api/functions/deepdream/
