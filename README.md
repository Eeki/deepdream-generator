# How to implement the actual image transformation
THIS: https://www.tensorflow.org/tutorials/generative/deepdream
OR THIS: https://hackernoon.com/deep-dream-with-tensorflow-a-practical-guide-to-build-your-first-deep-dream-experience-f91df601f479

# How to combine terraform and SAM
https://dev.to/rolfstreefkerk/how-to-setup-a-serverless-application-with-aws-sam-and-terraform-33m9

# Cognito

### Creating cognito user pool
https://serverless-stack.com/chapters/create-a-cognito-user-pool.html

### Create a user
First, we will use AWS CLI to sign up a user with their email and password.

```shell
aws cognito-idp sign-up \
  --region eu-north-1 \
  --client-id h060l9kpjb2vkpsblo0b097d5 \
  --username admin@example.com \
  --password Passw0rd!
```

Now, the user is created in Cognito User Pool. However, before the user can authenticate with the User Pool, the account needs to be verified. Let’s quickly verify the user using an administrator command.

```shell
aws cognito-idp admin-confirm-sign-up \
  --region eu-north-1 \
  --user-pool-id eu-north-1_sIbi8xvI8 \
  --username admin@example.com
```

### Create a Cognito Identity Pool
https://serverless-stack.com/chapters/create-a-cognito-identity-pool.html


## Ideas
- We don't need serverless. Use SAM with Terraform
  - https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html
- Käytä cloudfront:ia ui:n jakeluun.
- Nykyään lambdan voi deployata myös docker imagena. Workerit voisivat ollakkin siis vain lambda workereita fargate sijaan
  -  https://acloudguru.com/blog/engineering/packaging-aws-lambda-functions-as-container-images
  - Toteuta vain ne apit joiden pitää syystä tai toisesta olla toteutettu docker:illa dokcerilla, koska Zip deploy on yksinkertaisempi prosessi kuin docker deploy



# Localstack
https://reflectoring.io/aws-localstack/
https://github.com/thombergs/code-examples/tree/master/aws/localstack
https://spin.atomicobject.com/2020/02/03/localstack-terraform-circleci/
https://betterprogramming.pub/dont-be-intimidated-learn-how-to-run-aws-on-your-local-machine-with-localstack-2f3448462254

## For typescript see these
- https://github.com/typescript-cheatsheets/react
- https://github.com/labs42io/clean-code-typescript


## Some ideas for sqs producer-consumer
- https://github.com/serverless/examples/tree/master/aws-python-sqs-worker


## How to package python files as modules
- https://medium.com/@nate_mitchell/serverless-packaging-user-defined-python-modules-41808776eae0
