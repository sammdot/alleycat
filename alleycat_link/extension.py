from datetime import datetime
from plover import log
from plover.formatting import Formatter
from plover.steno import Stroke
from plover.translation import escape_translation, Translator

from alleycat_link.link import Link
from alleycat_link.utils import (
  jsonify,
  last_outline,
  MAX_TRANSLATIONS,
  STROKE_SEPARATOR,
  timecode,
)


class AlleyCATTranslator(Translator):
  def __init__(self, link):
    super().__init__()
    self._link = link

  def translate_translation(self, t):
    self._link._to_send["outline"] = {
      "steno": STROKE_SEPARATOR.join(t.rtfcre),
      "translation": t.english,
    }
    super().translate_translation(t)


class AlleyCATLinkExtension:
  def __init__(self, engine):
    self._engine = engine
    self._translator = AlleyCATTranslator(self)

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

  def _on_dictionaries_loaded(self, dicts):
    self._translator.set_dictionary(dicts)

  def _on_translated(self, old, new):
    self._to_send["translated"] = {
      "from": [jsonify(action) for action in old],
      "to": [jsonify(action) for action in new],
    }

  def _on_send_string(self, string):
    self._to_send["sent"].append({"type": "string", "string": string})

  def _on_send_backspaces(self, num):
    self._to_send["sent"].append({"type": "backspaces", "backspaces": num})

  def _on_send_key_combination(self, combo):
    self._to_send["sent"].append({"type": "key_combo", "key_combo": combo})

  def _on_stroked(self, stroke):
    self._translator.translate(stroke)
    self._to_send["stroked"] = stroke.rtfcre
    self._to_send["is_correction"] = stroke.is_correction

    now = datetime.now()
    self._to_send["timestamp"] = round(now.timestamp() * 100)
    self._to_send["timecode"] = timecode(now)

    log.debug(f"Sending to AlleyCAT Link: {self._to_send}")

    self._link.send(self._to_send)
    self._reset()
