import asyncio
import json
import os
import os.path
from plover import log
import sys
import threading


# Until both asyncio and Tokio support Unix domain sockets on Windows,
# Windows connectivity will have to be over TCP.
TCP_ADDRESS = ("127.0.0.1", 2228)
UNIX_ADDRESS = "/tmp/alleycat-link.sock"


class LinkHandler:
  def __init__(self, lst):
    self._all_clients = lst
    self._writer = None

  @property
  def addr(self):
    return (
      (
        self._writer.get_extra_info("peername")
        or self._writer.get_extra_info("sockname")
      )
      if self._writer
      else None
    )

  async def __call__(self, reader, writer):
    log.info(f"Connected to AlleyCAT on {self.addr}")
    self._all_clients.append(self)
    self._reader = reader
    self._writer = writer
    await self._loop()

  async def _loop(self):
    while True:
      line = await self._reader.readline()
      if not line:
        break

    log.info(f"AlleyCAT on {self.addr} disconnected")
    self._writer.close()
    await self._writer.wait_closed()
    self._all_clients.remove(self)

  async def send(self, obj):
    if self._writer.is_closing():
      return
    self._writer.write(json.dumps(obj).encode("utf-8"))
    self._writer.write(b"\r\n")
    await self._writer.drain()


class Link:
  def __init__(self):
    self._clients = []
    self._thread = threading.Thread(
      target=lambda: asyncio.run(self._start_server())
    )
    self._thread.start()

  async def _start_server(self):
    if sys.platform == "win32":
      host, port = TCP_ADDRESS
      self._server = await asyncio.start_server(
        LinkHandler(self._clients), host, port
      )
      log.info(f"Started AlleyCAT Link server on {host}:{port}")
    else:
      if os.path.exists(UNIX_ADDRESS):
        os.remove(UNIX_ADDRESS)
      self._server = await asyncio.start_unix_server(
        LinkHandler(self._clients), UNIX_ADDRESS
      )
      log.info(f"Started AlleyCAT Link server on {UNIX_ADDRESS}")
    async with self._server:
      await self._server.serve_forever()

  def close(self):
    self._thread.join()

  def send(self, obj):
    for client in self._clients:
      asyncio.run(client.send(obj))
