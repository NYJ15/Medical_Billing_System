import json
from sqlalchemy.ext.declarative import DeclarativeMeta


class AlchemyEncoder(json.JSONEncoder):
    """A JSON encoder that takes a sqlalchemy result object and converts it
    into a JSON encodable dict of the form 'column': 'value' using the model
    information.
    """
    def default(self, obj):
        if isinstance(obj.__class__, DeclarativeMeta):
            # an SQLAlchemy class
            fields = {}

            for field in [x for x in dir(obj) if not x.startswith('_') and
                                                 x != 'metadata']:
                data = obj.__getattribute__(field)

                if field in ["password", "keys", "query", "query_class", "two_fa_key", "registry"]:
                    pass

                else:
                    try:
                        json.dumps(data)
                        fields[field] = data
                    except TypeError:
                        fields[field] = str(data)
            return fields
        return json.JSONEncoder.default(self, obj)
