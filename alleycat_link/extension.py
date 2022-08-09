from plover import log

from alleycat_link.link import Link
from alleycat_link.utils import jsonify


class AlleyCATLinkExtension:
  def __init__(self, engine):
    self._engine = engine
    engine._alleycat_link = self

  def start(self):
    log.info("Initializing AlleyCAT link")
    self._link = Link()
    self._connect_hooks()
    self._reset()

  def _reset(self):
    self._to_send = {
      "stroked": None,
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
    self._link.send(self._to_send)
    self._reset()
