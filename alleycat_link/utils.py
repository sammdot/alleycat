import json


def jsonify(obj):
  return json.loads(json.dumps(obj.__dict__, default=lambda o: o.__dict__))
