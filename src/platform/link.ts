import { useEffect, useState } from "react"
import { listen } from "@tauri-apps/api/event"
import { invoke } from "@tauri-apps/api/tauri"

import { LinkData } from "src/models/link"
import { ConnectionState, PloverLink } from "src/platform/types"

export function usePloverLink(handler: (data: LinkData) => void): PloverLink {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.disconnected
  )

  const connect = () => {
    invoke("start_link", {})
  }

  const disconnect = () => {
    invoke("close_link", {})
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
        await listen<void>("acat://disconnected", (e) => {
          setConnectionState(ConnectionState.disconnected)
        }),
        await listen<any>("acat://stroked", (e) => {
          let payload = e.payload.trim()
          if (!payload) {
            return
          }

          try {
            const data = JSON.parse(payload) as LinkData
            handler(data)
          } catch (e) {
            return
          }
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
  }, [handler])

  return {
    canConnect: true,
    connectionState,
    connect,
    disconnect,
  }
}
