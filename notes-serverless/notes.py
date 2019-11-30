from __future__ import print_function

import boto3
import json
import uuid
import decimal

print('Loading function')


def update(event, context):
    if event.get('httpMethod') == 'POST' and event.get('body'): 
        body = json.loads(event.get('body'))
        notesList = body['notes']
    else:
        res = {
            "statusCode": 400,
            "headers": {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            "body": json.dumps('No POST or no BODY')
        }

        return res
    #print("Received event: " + json.dumps(event, indent=2))
    table = boto3.resource('dynamodb').Table('notes')

    response = table.put_item(
    Item={
            'id': "1",
            'notesList': notesList
        }
    )
    # return response
    return {
        "statusCode": 200,
        "headers": {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True,
        },
        "body": json.dumps('Updated')
    }


def get(event, context):
    #print("Received event: " + json.dumps(event, indent=2))
    table = boto3.resource('dynamodb').Table('notes')

    response = table.get_item(
    Key={
            'id': "1"
        }
    )

    item = response['Item']
    print("GetItem succeeded:")
    # print(json.dumps(item, indent=4, cls=DecimalEncoder))
    print(item)

    # return response
    return {
        "statusCode": 200,
        "headers": {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True,
        },
        "body": json.dumps(item)
    }