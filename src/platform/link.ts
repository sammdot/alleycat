import { useEffect, useState } from "react"
import { listen } from "@tauri-apps/api/event"
import { invoke } from "@tauri-apps/api/tauri"

import { ConnectionState, PloverLink } from "src/platform/types"

export function usePloverLink(): PloverLink {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.disconnected
  )

  const connect = () => {
    setConnectionState(ConnectionState.connecting)
    invoke("start_link", {})
  }

  const disconnect = () => {
    setConnectionState(ConnectionState.disconnected)
  }

  useEffect(() => {
    async function listenForEvents() {
      return [
        await listen<void>("acat://connecting", (e) => {
          setConnectionState(ConnectionState.connecting)
        }),
        await listen<void>("acat://connected", (e) => {
          setConnectionState(ConnectionState.connected)
        }),
        await listen<void>("acat://connect-failed", (e) => {
          setConnectionState(ConnectionState.disconnected)
        }),
        await listen<any>("acat://stroked", (e) => {
          // TODO
        }),
      ]
    }

    const listeners = listenForEvents()

    return () => {
      listeners.then((l) =>
        l.forEach((fn) => {
          fn()
        })
      )
    }
  }, [])

  return {
    canConnect: true,
    connectionState,
    connect,
    disconnect,
  }
}
