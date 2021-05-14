variable "region" {
  description = "AWS region"
  type        = string
}

variable "terraform_state_bucket" {
  description = "Bucket for the terraform remote state"
  type        = string
}

variable "force_destroy_buckets" {
  description = "You should put this on only if you are going to destroy the buckets."
  type        = bool
  default     = false
}
