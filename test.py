import boto3
import json
from botocore.response import StreamingBody

bedrock = boto3.client(service_name='bedrock-runtime')

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

# Check if 'body' in the response is of type StreamingBody
if isinstance(response.get('body'), StreamingBody):
    response_content = response['body'].read().decode('utf-8')
else:
    response_content = response.get('body')

response_body = json.loads(response_content)

# text
print(response_body)
