import json

FRAMES_PER_SECOND = 30
MAX_TRANSLATIONS = 5000
STROKE_SEPARATOR = "/"


def jsonify(obj):
  dic = dict(vars(obj))
  if "case" in dic:
    dic["case"] = dic["case"].value if dic["case"] else None
  if "next_case" in dic:
    dic["next_case"] = dic["next_case"].value if dic["next_case"] else None
  if "pattern" in dic:
    dic["pattern"] = dic["pattern"].pattern if dic["pattern"] else None
  if "action1" in dic:
    dic["action1"] = jsonify(dic["action1"]) if dic["action1"] else None
  if "action2" in dic:
    dic["action2"] = jsonify(dic["action2"]) if dic["action2"] else None
  return dic


def timecode(dt):
  # Assume 30 frames per second
  sec = dt.strftime("%H:%M:%S")
  frame = round(dt.microsecond * FRAMES_PER_SECOND // 1e6)
  return f"{sec}:{frame:02}"


def last_outline(tls):
  if not tls:
    return None

  strokes = []
  (_, _, actions) = tls[-1]
  for (stroke, old_actions, new_actions) in reversed(tls):
    strokes.append(stroke)
    actions -= new_actions - old_actions
    if old_actions == 0 and actions <= 0:
      return tuple(reversed(strokes))
