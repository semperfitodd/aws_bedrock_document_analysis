module "dynamodb_table" {
  source  = "terraform-aws-modules/dynamodb-table/aws"
  version = "3.3.0"

  name                           = var.environment
  server_side_encryption_enabled = false
  deletion_protection_enabled    = false

  hash_key    = "date"
  table_class = "STANDARD"

  attributes = [
    {
      name = "date"
      type = "S"
  }]

  tags = var.tags
}
