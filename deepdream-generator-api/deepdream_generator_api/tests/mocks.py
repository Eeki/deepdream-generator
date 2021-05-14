from dataclasses import dataclass


@dataclass
class MockGqlClient:
    result: dict

    def execute(self, *args, **kwargs):
        return self.result


def mock_gql_client(result):
    client = MockGqlClient(result)
    return lambda: client
