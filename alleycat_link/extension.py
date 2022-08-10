from collections import deque
from datetime import datetime
from plover import log

from alleycat_link.link import Link
from alleycat_link.utils import (
  jsonify,
  last_outline,
  MAX_TRANSLATIONS,
  STROKE_SEPARATOR,
  timecode,
)


class AlleyCATLinkExtension:
  def __init__(self, engine):
    self._engine = engine
    self._translations = deque(maxlen=MAX_TRANSLATIONS)
    engine._alleycat_link = self

  def start(self):
    log.info("Initializing AlleyCAT link")
    self._link = Link()
    self._connect_hooks()
    self._reset()

  def _reset(self):
    self._to_send = {
      "timestamp": None,
      "timecode": None,
      "stroked": None,
      "is_correction": None,
      "outline": None,
      "translated": None,
      "sent": [],
    }

  def stop(self):
    self._disconnect_hooks()
    log.info("Cleaning up AlleyCAT link")
    del self._link

  def reconnect(self):
    self._link.reconnect()

  def _connect_hooks(self):
    for hook in self._engine.HOOKS:
      if hasattr(self, f"_on_{hook}"):
        self._engine.hook_connect(hook, getattr(self, f"_on_{hook}"))

  def _disconnect_hooks(self):
    for hook in self._engine.HOOKS:
      if hasattr(self, f"_on_{hook}"):
        self._engine.hook_disconnect(hook, getattr(self, f"_on_{hook}"))

  def _on_translated(self, old, new):
    self._to_send["translated"] = {
      "old": [jsonify(action) for action in old],
      "new": [jsonify(action) for action in new],
    }

  def _on_send_string(self, string):
    self._to_send["sent"].append({"string": string})

  def _on_send_backspaces(self, num):
    self._to_send["sent"].append({"backspaces": num})

  def _on_send_key_combination(self, combo):
    self._to_send["sent"].append({"key_combo": combo})

  def _on_stroked(self, stroke):
    self._to_send["stroked"] = stroke.rtfcre
    self._to_send["is_correction"] = stroke.is_correction

    if stroke.is_correction:
      if self._translations:
        self._translations.pop()

      self._to_send["outline"] = {
        "steno": stroke.rtfcre,
        "translation": self._engine.lookup((stroke.rtfcre,)),
      }
    else:
      next_translation = (
        stroke.rtfcre,
        len(self._to_send["translated"]["old"]),
        len(self._to_send["translated"]["new"]),
      )
      self._translations.append(next_translation)

      outline = last_outline(self._translations)
      if outline:
        try:
          translation = self._engine.lookup(outline)
        except KeyError:
          translation = None
        self._to_send["outline"] = {
          "steno": STROKE_SEPARATOR.join(outline),
          "translation": translation,
        }
      else:
        self._to_send["outline"] = None

    now = datetime.now()
    self._to_send["timestamp"] = round(now.timestamp() * 100)
    self._to_send["timecode"] = timecode(now)

    log.debug(f"Sending to AlleyCAT Link: {self._to_send}")

    self._link.send(self._to_send)
    self._reset()
