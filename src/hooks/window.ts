import { useEffect } from "react"
import { appWindow } from "@tauri-apps/api/window"

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title ? title + " – AlleyCAT" : "AlleyCAT"
    appWindow.setTitle(title || "AlleyCAT")
  })
}

export function useCloseRequested(fn: () => void) {
  ;(window as any).onCloseRequested = fn

  useEffect(() => {
    appWindow.listen("tauri://close-requested", (e) => {
      ;(window as any).onCloseRequested?.()
    })
  }, [])
}
