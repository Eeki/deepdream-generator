variable "region" {
  description = "AWS region"
  type        = string
}

variable "force_destroy_buckets" {
  description = "You should put this on only if you are going to destroy the buckets."
  type        = bool
  default     = false
}

variable "domain_name" {
  description = "The domain name for the website."
  type        = string
}

variable "certificate_arn" {
  description = "The arn of the certificate that is used in the cloudfront."
  type        = string
}
