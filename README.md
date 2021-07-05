#### How to implement the actual image transformation
THIS: https://www.tensorflow.org/tutorials/generative/deepdream
OR THIS: https://hackernoon.com/deep-dream-with-tensorflow-a-practical-guide-to-build-your-first-deep-dream-experience-f91df601f479

#### Ideas
- We don't need serverless. Use SAM with Terraform
  - https://medium.com/geekculture/complete-end-to-end-guide-for-developing-dockerized-lambda-in-typescript-terraform-and-sam-cli-ecdea1c6e72c
  - https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html
- Käytä cloudfront:ia ui:n jakeluun.
- Toteuta vain ne apit joiden pitää syystä tai toisesta olla toteutettu docker:illa dokcerilla, koska Zip deploy on yksinkertaisempi prosessi kuin docker deploy


#### Localstack
https://reflectoring.io/aws-localstack/
https://github.com/thombergs/code-examples/tree/master/aws/localstack
https://spin.atomicobject.com/2020/02/03/localstack-terraform-circleci/
https://betterprogramming.pub/dont-be-intimidated-learn-how-to-run-aws-on-your-local-machine-with-localstack-2f3448462254
https://dev.to/goodidea/how-to-fake-aws-locally-with-localstack-27me

#### Some ideas for sqs producer-consumer
- https://github.com/serverless/examples/tree/master/aws-python-sqs-worker

#### How to package python files as modules
- https://medium.com/@nate_mitchell/serverless-packaging-user-defined-python-modules-41808776eae0

#### Could make sense to change the image processing service to run in aws ecs fargate.
- Then the rest of the lambdas could use python runtime without containers  

#### How to do a s3 image gallery 
- https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photos-view.html

#### MUST DO workshops
- https://github.com/dabit3/amplify-photo-sharing-workshop
- https://step-functions-workshop.go-aws.com/

#### Generally the workshops are great:
- https://workshops.aws/

#### Graphql api authorization:
https://docs.amazonaws.cn/en_us/appsync/latest/devguide/tutorial-dynamodb-resolvers.htm
https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-dynamodb.html#aws-appsync-resolver-mapping-template-reference-dynamodb-query
