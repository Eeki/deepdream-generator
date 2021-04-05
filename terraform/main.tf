terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

provider "aws" {
  region = "eu-north-1"
}

# S3
# ----------------------------------------------------------------------------------------------------------------------

resource "aws_s3_bucket" "public_client_bucket" {
  bucket = "deepdream-generator-public-client"

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
  identity_pool_name               = "deepdream-generator-identity-pool"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.client.id
    provider_name           = aws_cognito_user_pool.user_pool.endpoint
    server_side_token_check = false
  }
}

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
      "Action": "sts:AssumeRoleWithWebIdentity",
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
        "${aws_s3_bucket.user_data_bucket.arn}/private/$${cognito-identity.amazonaws.com:sub}/*"
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
  hash_key     = "userId"
  range_key    = "filePath"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "filePath"
    type = "S"
  }

  server_side_encryption {
    enabled = true
  }

  tags = {
    Name        = "dynamodb-table-file-table"
    Environment = "dev"
    Terraform   = true
  }

  lifecycle {
    prevent_destroy = true
  }
}
