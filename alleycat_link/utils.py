import json


def jsonify(obj):
  return json.loads(json.dumps(obj.__dict__, default=lambda o: o.__dict__))


def timecode(dt):
  # Assume 30 frames per second
  sec = dt.strftime("%H:%M:%S")
  frame = round(dt.microsecond * 30 // 1e6)
  return f"{sec}:{frame:02}"
