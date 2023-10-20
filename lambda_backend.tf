locals {
  backend_lambda_name = "fitness_chatbot"
}

module "lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "${var.environment}-function"
  description   = "${var.environment} Fitness Chatbot"
  handler       = "${local.backend_lambda_name}.lambda_handler"
  runtime       = "python3.11"
  timeout       = 30

  source_path = [
    {
      path             = "${path.module}/${local.backend_lambda_name}"
      pip_requirements = true
    }
  ]

  attach_policies = true
  policies        = ["arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"]

  attach_policy_statements = true
  policy_statements = {
    bedrock_invoke = {
      effect    = "Allow",
      actions   = ["bedrock:InvokeModel"],
      resources = ["*"]
    },
  }

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*"
    }
  }

  cloudwatch_logs_retention_in_days = 30

  tags = var.tags
}
