FROM public.ecr.aws/lambda/python:3.8

WORKDIR ${LAMBDA_TASK_ROOT}

COPY ./functions/jobs/requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY ./functions/jobs/*.py ./deepdream_generator_api/functions/jobs/
COPY ./libs/ ./deepdream_generator_api/libs/
