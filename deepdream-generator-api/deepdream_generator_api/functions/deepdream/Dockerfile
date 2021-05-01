FROM public.ecr.aws/lambda/python:3.8

WORKDIR ${LAMBDA_TASK_ROOT}

COPY ./functions/deepdream/requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY ./functions/deepdream/*.py ./deepdream_generator_api/functions/deepdream/
COPY ./libs/*.py ./deepdream_generator_api/libs/
COPY ./models/*.py ./deepdream_generator_api/models/
