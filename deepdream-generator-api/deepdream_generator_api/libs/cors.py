from typing import List, Union


# TODO set the CORS headers in the API gateway so this can be removed
def get_cors_headers(methods: Union[List[str], None]):
    parsed_methods = '*' if not methods else ', '.join(methods)
    return {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': parsed_methods
    }
