def main(event, context):
    response = {
        'statusCode': 200,
        # TODO set the CORS headers in the API gateway
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, GET'
        },
        'body': '{"moikka": 1}'
    }

    return response
