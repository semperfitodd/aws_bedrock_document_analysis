locals {
  backend_lambda_name = var.environment
}

data "archive_file" "backend" {
  source_file = "${path.module}/backend/backend.py"
  output_path = "${path.module}/backend/backend.zip"
  type        = "zip"
}

data "aws_iam_policy" "AWSLambdaBasicExecutionRole" {
  name = "AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "backend_lambda_execution_role" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      identifiers = ["lambda.amazonaws.com"]
      type        = "Service"
    }
  }
}

data "aws_iam_policy_document" "lambda_policy" {
  statement {
    actions   = ["dynamodb:*"]
    effect    = "Allow"
    resources = [module.dynamodb_table.dynamodb_table_arn]
  }
  statement {
    actions = [
      "secretsmanager:DescribeSecret",
      "secretsmanager:Get*",
      "secretsmanager:ListSecretVersionIds",
    ]
    resources = ["*"]
  }
  statement {
    actions   = ["polly:SynthesizeSpeech"]
    effect    = "Allow"
    resources = ["*"]
  }
}

resource "aws_iam_policy" "lambda_policy" {
  name   = "${var.environment}_lambda_policy"
  policy = data.aws_iam_policy_document.lambda_policy.json

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_execution_role_backend.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

resource "aws_iam_role" "lambda_execution_role_backend" {
  name = "${var.environment}_lambda_execution_role"

  assume_role_policy = data.aws_iam_policy_document.backend_lambda_execution_role.json

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "lambda_execution_policy" {
  policy_arn = data.aws_iam_policy.AWSLambdaBasicExecutionRole.arn
  role       = aws_iam_role.lambda_execution_role_backend.name
}

resource "aws_lambda_function" "backend" {
  filename      = data.archive_file.backend.output_path
  description   = "Create stories and store in DynamoDB"
  function_name = local.backend_lambda_name
  role          = aws_iam_role.lambda_execution_role_backend.arn
  handler       = "${local.backend_lambda_name}.lambda_handler"
  runtime       = "python3.9"
  timeout       = 30

  environment {
    variables = {
      ENVIRONMENT = module.dynamodb_table.dynamodb_table_id
    }
  }

  source_code_hash = data.archive_file.backend.output_base64sha256

  tags = var.tags
}