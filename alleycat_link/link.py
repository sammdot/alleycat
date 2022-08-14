import json
import os
import os.path
from plover import log
import queue
import socketserver
import sys
import threading


# Until both asyncio and Tokio support Unix domain sockets on Windows,
# Windows connectivity will have to be over TCP.
TCP_ADDRESS = ("127.0.0.1", 2228)
UNIX_ADDRESS = "/tmp/alleycat-link.sock"


class TCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
  allow_reuse_address = True


class UnixServer(socketserver.ThreadingMixIn, socketserver.UnixStreamServer):
  allow_reuse_address = True


class Handler(socketserver.StreamRequestHandler):
  @property
  def addr(self):
    if self.client_address:
      host, port = self.client_address
      return f"{host}:{port}"
    else:
      return UNIX_ADDRESS

  def handle(self):
    log.info(f"Connected to AlleyCAT on {self.addr}")
    self.finished = threading.Event()
    thread = threading.Thread(target=self._loop)
    thread.start()
    while line := self.rfile.readline():
      pass
    log.info(f"AlleyCAT on {self.addr} disconnected")
    self.finished.set()
    self.server.queue.join()
    thread.join()

  def _loop(self):
    while not self.finished.is_set():
      try:
        obj = self.server.queue.get(timeout=0.1)
        log.debug(f"Sending to AlleyCAT: {obj}")
        self.wfile.write(json.dumps(obj).encode("utf-8"))
        self.wfile.write(b"\r\n")
        self.server.queue.task_done()
      except queue.Empty:
        continue


class Link:
  def __init__(self):
    if sys.platform == "win32":
      self._server = TCPServer(TCP_ADDRESS, Handler)
    else:
      if os.path.exists(UNIX_ADDRESS):
        os.remove(UNIX_ADDRESS)
      self._server = UnixServer(UNIX_ADDRESS, Handler)
    self._queue = queue.Queue()
    self._server.queue = self._queue
    self._thread = None

  @property
  def addr(self):
    return self._server.server_address

  def start(self):
    if self._thread:
      log.info("Waiting for previous connection to end")
      self._thread.join()
    self._thread = threading.Thread(target=self._server.serve_forever)
    self._thread.daemon = True
    self._thread.start()
    log.info(f"Started AlleyCAT Link server on {self.addr}")

  def close(self):
    log.info(f"Shutting down AlleyCAT Link server on {self.addr}")
    self._server.shutdown()
    self._server.server_close()
    self._thread.join()
    self._thread = None

  def send(self, obj):
    self._queue.put(obj)
