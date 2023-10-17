# AWS Bedrock Fitness Chatbot
This project is an implementation of a fitness chatbot hosted on AWS. The frontend, which is built with React, is served via S3 and CloudFront, and it interacts with an API Gateway. This API Gateway triggers a Lambda function which, in turn, utilizes AWS Bedrock, a new foundational model generation offering from AWS.

## Architecture
![architecture.png](images%2Farchitecture.png)

## Setting up the Project

### Prerequisites

- [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)
- [AWS CLI](https://aws.amazon.com/cli/)
- [Node.js & npm](https://nodejs.org/)

### Instructions

1. **Frontend Setup**:
   
   Navigate to the React frontend:
   
   ```bash
   cd static_site/crossfit-website
   ```
   Install the required dependencies:

   ```bash
   npm install
   ```
   Build the React project:

   ```bash
   npm run build
   ```
2. Backend Setup:

   Ensure you have your AWS CLI set up with the required credentials. Set up your Terraform workspace:

   ```bash
   terraform init
   ```
   Plan and apply the Terraform configurations:

   ```bash
   terraform plan -out=plan.out
   terraform apply "plan.out"
   ```
   **Note:** You will need run the plan and apply 2x because of building the lambda zip file.
3. Access the App:

   Once the Terraform configurations are applied, you can access the React app via the custom domain you've set up one in Route53.

   ![chatbot0.png](images%2Fchatbot0.png)
   
   ![chatbot1.png](images%2Fchatbot1.png)
   
   ![chatbot2.png](images%2Fchatbot2.png)
   
   ![chatbot3.png](images%2Fchatbot3.png)

## How It Works
* **React Frontend:** The React frontend provides an interface for users to interact with the chatbot. It sends requests to the API Gateway.

* **API Gateway:** On receiving a request from the frontend, the API Gateway triggers the Lambda function.

* **Lambda & AWS Bedrock:** The Lambda function processes the input from the frontend and utilizes AWS Bedrock to generate model-based responses. These responses are then sent back to the frontend.