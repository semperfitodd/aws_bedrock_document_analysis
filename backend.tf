terraform {
  backend "s3" {
    bucket = "bsc.sandbox.terraform.state"
    key    = "fitness_chatbot/terraform.tfstate"
    region = "us-east-2"
  }
}