locals {
  backend_lambda_name = var.environment

  venv_name = "venv"
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
    actions = [
      "bedrock:InvokeModel",
    ]
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
  filename      = "${path.module}/${local.backend_lambda_name}/${local.backend_lambda_name}.zip"
  description   = "Fitness Chatbot"
  function_name = local.backend_lambda_name
  role          = aws_iam_role.lambda_execution_role_backend.arn
  handler       = "${local.backend_lambda_name}.lambda_handler"
  runtime       = "python3.11"
  timeout       = 30

  source_code_hash = filebase64sha256("${path.module}/${local.backend_lambda_name}/${local.backend_lambda_name}.zip")

  tags = var.tags

  depends_on = [null_resource.package_lambda]
}

resource "null_resource" "package_lambda" {
  provisioner "local-exec" {
    command = <<-EOF
      VENV_NAME="${local.venv_name}"
      FILES_DIRECTORY="./${local.backend_lambda_name}"
      OPENAI_FILENAME="${local.backend_lambda_name}"

      # Creating a python virtual environment
      python3.9 -m venv $VENV_NAME

      # Activating the virtual environment
      source $VENV_NAME/bin/activate

      # Installing the requirements
      pip3.9 install -r $FILES_DIRECTORY/requirements.txt

      # Copying the python packages to the files directory
      cp -R $VENV_NAME/lib/python3.9/site-packages/ $FILES_DIRECTORY/

      # Going into the files directory
      cd $FILES_DIRECTORY

      # Remove old zip file
      rm -f $OPENAI_FILENAME.zip

      # Creating the zip file
      zip -r $OPENAI_FILENAME.zip .

      # Removing the files and directories after zip is created
      find . -mindepth 1 -type d -exec rm -r {} \;
      rm *.pth
      rm six.py
      deactivate

      # Removing the virtual environment directory
      cd ..
      rm -rf $VENV_NAME
    EOF
  }
  triggers = {
    requirements_hash    = filesha256("${path.module}/${local.backend_lambda_name}/requirements.txt")
    story_generator_hash = filesha256("${path.module}/${local.backend_lambda_name}/${local.backend_lambda_name}.py")
  }
}