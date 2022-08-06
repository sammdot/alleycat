import { useEffect } from "react"
import { Event } from "@tauri-apps/api/event"
import { appWindow } from "@tauri-apps/api/window"

const w: any = window

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title ? title + " – AlleyCAT" : "AlleyCAT"
    appWindow.setTitle(title || "AlleyCAT")
  })
}

export function useCloseRequested(fn: () => void) {
  w.onCloseRequested = fn

  useEffect(() => {
    appWindow.listen("tauri://close-requested", (e) => {
      w.onCloseRequested?.()
    })
  }, [])
}

export function useFileDropEvent(
  onHover: (paths: string[]) => void,
  onCancel: () => void,
  onDrop: (paths: string[]) => void
) {
  w.onFileDropHover = onHover
  w.onFileDropCancel = onCancel
  w.onFileDrop = onDrop

  useEffect(() => {
    appWindow.listen<Event<string[]>>("tauri://file-drop-hover", (e) => {
      w.onFileDropHover?.(e.payload)
    })
    appWindow.listen<Event<void>>("tauri://file-drop-cancelled", (e) => {
      w.onFileDropCancel?.()
    })
    appWindow.listen<Event<string[]>>("tauri://file-drop", (e) => {
      w.onFileDrop?.(e.payload)
    })
  }, [])
}
