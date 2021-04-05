from datetime import datetime
import json

from pynamodb.models import Model
from pynamodb.attributes import MapAttribute


class BaseModel(Model):
    def to_json(self, indent=2):
        return json.dumps(self.to_dict(), indent=indent)

    def to_dict(self):
        return {
            key: self._attr_to_obj(value)
            for key, value
            in self.attribute_values.items()
        }

    def _attr_to_obj(self, attr):
        # compare with list class. It is not ListAttribute.
        if isinstance(attr, list):
            return [self._attr_to_obj(item) for item in attr]
        elif isinstance(attr, MapAttribute):
            return {
                key: self._attr_to_obj(value)
                for key, value
                in attr.attribute_values.items()
            }
        elif isinstance(attr, datetime):
            return attr.isoformat()
        else:
            return attr
