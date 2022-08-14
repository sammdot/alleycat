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


class Link:
  def __init__(self):
    self._writer = None
    self._thread = threading.Thread(
      target=lambda: asyncio.run(self._start_server())
    )
    self._thread.start()

  def close(self):
    self._thread.join()

  async def _start_server(self):
    if sys.platform == "win32":
      host, port = TCP_ADDRESS
      self._server = await asyncio.start_server(self._handle, host, port)
      log.info(f"Started AlleyCAT Link server on {host}:{port}")
    else:
      if os.path.exists(UNIX_ADDRESS):
        os.remove(UNIX_ADDRESS)
      self._server = await asyncio.start_unix_server(self._handle, UNIX_ADDRESS)
      log.info(f"Started AlleyCAT Link server on {UNIX_ADDRESS}")
    async with self._server:
      await self._server.serve_forever()

  async def _handle(self, reader, writer):
    cli = writer.get_extra_info("peername") or writer.get_extra_info("sockname")
    log.info(f"Connected to AlleyCAT on {cli}")
    await self._loop(reader, writer)
    writer.close()
    await writer.wait_closed()
    log.info(f"AlleyCAT on {cli} disconnected")

  async def _send(self, obj):
    if writer := self._writer:
      writer.write(json.dumps(obj).encode("utf-8"))
      writer.write(b"\r\n")
      await writer.drain()

  def send(self, obj):
    asyncio.run(self._send(obj))

  async def _loop(self, reader, writer):
    self._writer = writer
    while True:
      line = await reader.readline()
      if not line:
        break
    self._writer = None
