import json
import boto3
import logging
from botocore.response import StreamingBody

logger = logging.getLogger()
logger.setLevel(logging.INFO)

bedrock = boto3.client(service_name='bedrock-runtime')

def invoke_bedrock_model(event, context):
    body = json.dumps({
        "prompt": "\n\nHuman: Act as a personal trainer at a CrossFit gym. how do i get better at power cleans?\n\nAssistant:",
        "max_tokens_to_sample": 3000,
        "temperature": 0.5,
        "top_p": 1,
    })

    modelId = 'anthropic.claude-instant-v1'
    accept = 'application/json'
    contentType = 'application/json'

    response = bedrock.invoke_model(body=body, modelId=modelId, accept=accept, contentType=contentType)

    if isinstance(response.get('body'), StreamingBody):
        response_content = response['body'].read().decode('utf-8')
    else:
        response_content = response.get('body')
        response_content = response.get('body')

    response_body = json.loads(response_content)

    logger.info(response_body)
    return response_body

# AWS Lambda handler
def lambda_handler(event, context):
    return invoke_bedrock_model(event, context)
