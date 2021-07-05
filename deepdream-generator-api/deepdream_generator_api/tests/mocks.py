import json
from dataclasses import dataclass
from collections import defaultdict


@dataclass
class GqlMockClient:
    responses: dict
    recorded_inputs = defaultdict(list)

    def execute(self, document, *args, variable_values):
        operation_name = document.definitions[0].name.value
        self.recorded_inputs[operation_name].append(json.loads(variable_values))
        return self.responses.get(operation_name, None)
