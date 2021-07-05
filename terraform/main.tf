# TODO standardize naming (_ vs -)

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.29"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.1"
    }
  }
}

provider "aws" {
  region = var.region
}

locals {
  module_path        = abspath(path.module)
  codebase_root_path = abspath("${path.module}/..")
}

# S3
# ----------------------------------------------------------------------------------------------------------------------

resource "aws_s3_bucket" "public_client_bucket" {
  bucket = "deepdream-generator-public-client"
  force_destroy=var.force_destroy_buckets

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "public_client_bucket" {
  bucket             = aws_s3_bucket.public_client_bucket.id
  ignore_public_acls = true
  block_public_acls  = true
}

resource "aws_s3_bucket_policy" "public_client_policy" {
  bucket = aws_s3_bucket.public_client_bucket.id
  # Because of a bug https://github.com/hashicorp/terraform-provider-aws/issues/7628
  depends_on = [aws_s3_bucket_public_access_block.public_client_bucket]
  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "public_client_s3_bucket_policy"
    Statement = [
      {
        Sid: "PublicReadForGetBucketObjects",
        Effect: "Allow",
        Principal: "*",
        Action: "s3:GetObject",
        Resource: "${aws_s3_bucket.public_client_bucket.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket" "user_data_bucket" {
  bucket = "deepdream-generator-user-data"
  force_destroy=var.force_destroy_buckets

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    // allowed_origins = [aws_s3_bucket.public_client_bucket.website_endpoint]
    // TODO set the allowed_origins from .tfvars
    allowed_origins = ["*"]
    expose_headers  = [
      "x-amz-server-side-encryption",
      "x-amz-request-id",
      "x-amz-id-2",
      "ETag"
    ]
    max_age_seconds = 3000
  }
}


# User Pool
# ----------------------------------------------------------------------------------------------------------------------

resource "aws_cognito_user_pool" "user_pool" {
  name                     = "deepdream-generator-user-pool"
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  username_configuration {
    case_sensitive = false
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }

  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    mutable             = true
    required            = true

    string_attribute_constraints {
      min_length = 6
      max_length = 256
    }
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name                          = "deepdream-generator-user-pool-client"
  user_pool_id                  = aws_cognito_user_pool.user_pool.id
  prevent_user_existence_errors = "ENABLED"
  explicit_auth_flows = [
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "deepdream-generator-user-pool-domain"
  user_pool_id = aws_cognito_user_pool.user_pool.id
}

# Identity Pool
# ----------------------------------------------------------------------------------------------------------------------

resource "aws_cognito_identity_pool" "main" {
  identity_pool_name               = "deepdream_generator_identity_pool"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.client.id
    provider_name           = aws_cognito_user_pool.user_pool.endpoint
    server_side_token_check = false
  }
}

# TODO create this workaround
# Use this workaround until resource aws_cognito_identity_pool_provider_principal_tag_mapping is part of terraform
# https://github.com/hashicorp/terraform-provider-aws/issues/17345
//resource "null_resource" "principal_tag_attribute_map" {
//  provisioner "local-exec" {
//    command = <<EOT
//aws cognito-identity set-principal-tag-attribute-map \
//--identity-pool-id ${aws_cognito_identity_pool.main.id} \
//--identity-provider-name ${aws_cognito_user_pool.user_pool.endpoint} \
//--use-defaults
//EOT
//  }
//}


resource "aws_iam_role" "deepdream-generator-authenticated-role" {
  name               = "deepdream-generator-authenticated-user-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": [
        "sts:AssumeRoleWithWebIdentity",
        "sts:TagSession"
      ],
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "${aws_cognito_identity_pool.main.id}"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated"
        }
      }
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "deepdream-generator-authenticated-policy" {
  name   = "deepdream_generator_authenticated_policy"
  role   = aws_iam_role.deepdream-generator-authenticated-role.id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "mobileanalytics:PutEvents",
        "cognito-sync:*",
        "cognito-identity:*"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "${aws_s3_bucket.user_data_bucket.arn}/private/$${aws:PrincipalTag/username}",
        "${aws_s3_bucket.user_data_bucket.arn}/private/$${aws:PrincipalTag/username}/*"
      ]
    }
  ]
}
EOF
}

resource "aws_cognito_identity_pool_roles_attachment" "main" {
  identity_pool_id = aws_cognito_identity_pool.main.id
  roles = {
    "authenticated" = aws_iam_role.deepdream-generator-authenticated-role.arn
  }
}

# DynamoDb
# ----------------------------------------------------------------------------------------------------------------------
// TODO the file-table need better name than "Files".
// Add some set/random prefix and Environment prefix (dev, test, prod)
resource "aws_dynamodb_table" "file-table" {
  name         = "Files"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "user_id"
  range_key    = "file_path"

  attribute {
    name = "user_id"
    type = "S"
  }

  attribute {
    name = "file_path"
    type = "S"
  }

  server_side_encryption {
    enabled = true
  }

  lifecycle {
    prevent_destroy = false
  }

  tags = {
    Name        = "dynamodb-table-file-table"
    Environment = "dev"
    Terraform   = true
  }
}

resource "aws_dynamodb_table" "job-table" {
  name         = "Jobs"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "user_id"
  range_key    = "id"

  attribute {
    name = "user_id"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "input_path"
    type = "S"
  }

  local_secondary_index {
    name = "input_path_index"
    projection_type = "ALL"
    range_key = "input_path"
  }

  server_side_encryption {
    enabled = true
  }

  lifecycle {
    prevent_destroy = false
  }

  tags = {
    Name        = "dynamodb-table-job-table"
    Environment = "dev"
    Terraform   = true
  }
}

resource "aws_sqs_queue" "job_queue_deadletter" {
  name                      = "job-queue-deadletter"
  delay_seconds             = 30
  receive_wait_time_seconds = 10

  tags = {
    Name        = "sqs-job-queue-deadletter"
    Environment = "dev"
    Terraform   = true
  }
}

resource "aws_sqs_queue" "job_queue" {
  name                       = "job-queue"
  message_retention_seconds  = 86400
  visibility_timeout_seconds = 120
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.job_queue_deadletter.arn
    maxReceiveCount     = 2
  })

  tags = {
    Name        = "sqs-job-queue"
    Environment = "dev"
    Terraform   = true
  }
}


# App sync
# ----------------------------------------------------------------------------------------------------------------------
resource "aws_appsync_graphql_api" "deepdreams" {
  authentication_type = "AMAZON_COGNITO_USER_POOLS"
  name                = "deepdream_graphql_api"
  schema              = file("schema.graphql")

  user_pool_config {
    aws_region     = var.region
    default_action = "ALLOW"
    user_pool_id   = aws_cognito_user_pool.user_pool.id
  }

  additional_authentication_provider {
    authentication_type = "AWS_IAM"
  }
}

resource "aws_iam_role" "deepdreams_appsync_datasource_role" {
  name = "deepdreams_appsync_datasource_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "appsync.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "deepdreams_appsync_datasource_policy" {
  name   = "deepdreams_appsync_datasource_policy"
  role   = aws_iam_role.deepdreams_appsync_datasource_role.id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:*"
      ],
      "Effect": "Allow",
      "Resource": [
        "${aws_dynamodb_table.file-table.arn}",
        "${aws_dynamodb_table.job-table.arn}"
      ]
    }
  ]
}
EOF
}

# App sync Data sources
# ----------------------------------------------------------------------------------------------------------------------

resource "aws_appsync_datasource" "none" {
  api_id = aws_appsync_graphql_api.deepdreams.id
  name   = "appsync_datasource_none"
  type   = "NONE"
}

resource "aws_appsync_datasource" "deepdreams_file_records" {
  api_id           = aws_appsync_graphql_api.deepdreams.id
  name             = "appsync_datasource_deepdreams_file_records"
  service_role_arn = aws_iam_role.deepdreams_appsync_datasource_role.arn
  type             = "AMAZON_DYNAMODB"

  dynamodb_config {
    table_name = aws_dynamodb_table.file-table.name
  }
}

resource "aws_appsync_datasource" "deepdreams_job" {
  api_id           = aws_appsync_graphql_api.deepdreams.id
  name             = "appsync_datasource_deepdreams_jobs"
  service_role_arn = aws_iam_role.deepdreams_appsync_datasource_role.arn
  type             = "AMAZON_DYNAMODB"

  dynamodb_config {
    table_name = aws_dynamodb_table.job-table.name
  }
}

# App sync resolvers file records
# ----------------------------------------------------------------------------------------------------------------------

resource "aws_appsync_resolver" "deepdreams_create_file" {
  api_id            = aws_appsync_graphql_api.deepdreams.id
  data_source       = aws_appsync_datasource.deepdreams_file_records.name
  type              = "Mutation"
  field             = "createFile"
  request_template  = file("appsync-mapping-templates/requests/create-file-record.vm")
  response_template = file("appsync-mapping-templates/responses/single.vm")
}

resource "aws_appsync_resolver" "deepdreams_create_own_file" {
  api_id            = aws_appsync_graphql_api.deepdreams.id
  data_source       = aws_appsync_datasource.deepdreams_file_records.name
  type              = "Mutation"
  field             = "createOwnFile"
  request_template  = file("appsync-mapping-templates/requests/create-own-file-record.vm")
  response_template = file("appsync-mapping-templates/responses/single.vm")
}

resource "aws_appsync_resolver" "deepdreams_delete_own_file" {
  api_id            = aws_appsync_graphql_api.deepdreams.id
  data_source       = aws_appsync_datasource.deepdreams_file_records.name
  type              = "Mutation"
  field             = "deleteOwnFile"
  request_template = file("appsync-mapping-templates/requests/delete-own-file-record.vm")
  response_template = file("appsync-mapping-templates/responses/single.vm")
}

resource "aws_appsync_resolver" "deepdream_list_files" {
  api_id            = aws_appsync_graphql_api.deepdreams.id
  data_source       = aws_appsync_datasource.deepdreams_file_records.name
  type              = "Query"
  field             = "listUserFiles"
  request_template  = file("appsync-mapping-templates/requests/list-user-items.vm")
  response_template = file("appsync-mapping-templates/responses/paginated-list.vm")
}

resource "aws_appsync_resolver" "deepdream_on_create_file" {
  api_id            = aws_appsync_graphql_api.deepdreams.id
  data_source       = aws_appsync_datasource.none.name
  type              = "Subscription"
  field             = "onCreateFile"
  request_template  = file("appsync-mapping-templates/requests/subscribe-any.vm")
  response_template = file("appsync-mapping-templates/responses/subscribe-single.vm")
}

# App sync resolvers jobs
# ----------------------------------------------------------------------------------------------------------------------

resource "aws_appsync_resolver" "deepdream_list_user_jobs" {
  api_id            = aws_appsync_graphql_api.deepdreams.id
  data_source       = aws_appsync_datasource.deepdreams_job.name
  type              = "Query"
  field             = "listUserJobs"
  request_template  = file("appsync-mapping-templates/requests/list-user-items.vm")
  response_template = file("appsync-mapping-templates/responses/paginated-list.vm")
}

resource "aws_appsync_resolver" "deepdream_get_job" {
  api_id            = aws_appsync_graphql_api.deepdreams.id
  data_source       = aws_appsync_datasource.deepdreams_job.name
  type              = "Query"
  field             = "getJob"
  request_template  = file("appsync-mapping-templates/requests/get-job.vm")
  response_template = file("appsync-mapping-templates/responses/single.vm")
}

resource "aws_appsync_resolver" "deepdream_create_job" {
  api_id            = aws_appsync_graphql_api.deepdreams.id
  data_source       = aws_appsync_datasource.deepdreams_job.name
  type              = "Mutation"
  field             = "createJob"
  request_template  = file("appsync-mapping-templates/requests/create-job.vm")
  response_template = file("appsync-mapping-templates/responses/single.vm")
}

resource "aws_appsync_resolver" "deepdream_update_job" {
  api_id            = aws_appsync_graphql_api.deepdreams.id
  data_source       = aws_appsync_datasource.deepdreams_job.name
  type              = "Mutation"
  field             = "updateJob"
  request_template  = file("appsync-mapping-templates/requests/update-job.vm")
  response_template = file("appsync-mapping-templates/responses/single.vm")
}

resource "aws_appsync_resolver" "deepdream_on_create_job_subscription" {
  api_id            = aws_appsync_graphql_api.deepdreams.id
  data_source       = aws_appsync_datasource.none.name
  type              = "Subscription"
  field             = "onCreateJob"
  request_template  = file("appsync-mapping-templates/requests/subscribe-any.vm")
  response_template = file("appsync-mapping-templates/responses/subscribe-single.vm")
}

resource "aws_appsync_resolver" "deepdream_on_update_job_subscription" {
  api_id            = aws_appsync_graphql_api.deepdreams.id
  data_source       = aws_appsync_datasource.none.name
  type              = "Subscription"
  field             = "onUpdateJob"
  request_template  = file("appsync-mapping-templates/requests/subscribe-any.vm")
  response_template = file("appsync-mapping-templates/responses/subscribe-single.vm")
}

# SSM
# ----------------------------------------------------------------------------------------------------------------------

resource "aws_ssm_parameter" "user_data_bucket_arn" {
  name = "/deepdreams/s3/bucket/user-data/arn"
  type = "String"
  value = aws_s3_bucket.user_data_bucket.arn
}

resource "aws_ssm_parameter" "user_data_bucket_name" {
  name = "/deepdreams/s3/bucket/user-data/name"
  type = "String"
  value = aws_s3_bucket.user_data_bucket.bucket
}

resource "aws_ssm_parameter" "public_client_bucket_name" {
  name = "/deepdreams/s3/bucket/public-client/name"
  type = "String"
  value = aws_s3_bucket.public_client_bucket.bucket
}

resource "aws_ssm_parameter" "dynamodb_table_files_arn" {
  name = "/deepdreams/dynamodb/table/files/arn"
  type = "String"
  value = aws_dynamodb_table.file-table.arn
}

resource "aws_ssm_parameter" "dynamodb_table_files_name" {
  name = "/deepdreams/dynamodb/table/files/name"
  type = "String"
  value = aws_dynamodb_table.file-table.name
}

resource "aws_ssm_parameter" "dynamodb_table_jobs_arn" {
  name = "/deepdreams/dynamodb/table/jobs/arn"
  type = "String"
  value = aws_dynamodb_table.job-table.arn
}

resource "aws_ssm_parameter" "dynamodb_table_jobs_name" {
  name = "/deepdreams/dynamodb/table/jobs/name"
  type = "String"
  value = aws_dynamodb_table.job-table.name
}

resource "aws_ssm_parameter" "sqs_queue_job_arn" {
  name = "/deepdreams/sqs/queue/job/arn"
  type = "String"
  value = aws_sqs_queue.job_queue.arn
}

resource "aws_ssm_parameter" "sqs_queue_job_name" {
  name = "/deepdreams/sqs/queue/job/name"
  type = "String"
  value = aws_sqs_queue.job_queue.name
}

resource "aws_ssm_parameter" "sqs_queue_job_url" {
  name = "/deepdreams/sqs/queue/job/url"
  type = "String"
  value = aws_sqs_queue.job_queue.id # Url is id of queue
}

resource "aws_ssm_parameter" "cognito_userpool_arn" {
  name = "/deepdreams/cognito/userpool/arn"
  type = "String"
  value = aws_cognito_user_pool.user_pool.arn
}

resource "aws_ssm_parameter" "appsync_endpoint" {
  name = "/deepdreams/appsync/endpoint/graphql"
  type = "String"
  value = lookup(aws_appsync_graphql_api.deepdreams.uris, "GRAPHQL")
}

resource "aws_ssm_parameter" "appsync_arn" {
  name = "/deepdreams/appsync/arn"
  type = "String"
  value = aws_appsync_graphql_api.deepdreams.arn
}

resource "local_file" "client_config" {
  content  = jsonencode({
    "region" = var.region,
    "userDataBucket" = aws_s3_bucket.user_data_bucket.bucket,
    "userPoolId": aws_cognito_user_pool.user_pool.id,
    "userPoolWebClientId": aws_cognito_user_pool_client.client.id,
    "identityPoolId": aws_cognito_identity_pool.main.id,
    "graphqlEndpoints": aws_appsync_graphql_api.deepdreams.uris
  })
  filename = "${local.codebase_root_path}/client/public/config.json"
}
