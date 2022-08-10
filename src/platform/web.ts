import { Dispatch, SetStateAction } from "react"
import { useBeforeunload } from "react-beforeunload"

import { defaultSettings, Settings } from "src/models/settings"
import { FileDropProps, FileOpenProps } from "src/platform/types"

export const canOpenNewWindow = false

export function showError(err: any, title: string) {
  alert(err.toString())
}

export function setTitle(title: string) {
  document.title = title ? title + " – AlleyCAT" : "AlleyCAT"
}

export async function splitPath(
  path: string
): Promise<[string | null, string]> {
  return [null, path]
}

export const windowDragAreaProps: {} = {}

export function usePreventClose(
  preventFn: () => boolean,
  backToMainScreen: () => boolean
) {
  useBeforeunload((e: any) => {
    if (preventFn()) {
      e.preventDefault()
    }
  })
}

export function useFileDrop(
  setDragging: Dispatch<SetStateAction<boolean>>,
  fileDropped: (path: string, file: File | null) => void
): FileDropProps {
  const canOpenItem = (item: DataTransferItem) => item.type === "text/rtf"

  return {
    onDragOver: (e) => {
      e.stopPropagation()
      e.preventDefault()
    },
    onDragEnter: (e) => {
      e.stopPropagation()
      e.preventDefault()
      setDragging(true)
    },
    onDragLeave: (e) => {
      e.stopPropagation()
      e.preventDefault()
      setDragging(false)
    },
    onDrop: (e) => {
      e.stopPropagation()
      e.preventDefault()
      setDragging(false)

      if (!e.dataTransfer) {
        return
      }

      let files = Array.from(e.dataTransfer.items)
        .filter((item) => item.kind === "file")
        .filter(canOpenItem)
        .map((item) => item.getAsFile())
      if (files.length !== 1) {
        return
      }

      let file = files[0]!
      fileDropped(file.name, file)
    },
  }
}

export function useOpenDialog(
  openFn: (path: string, file: File | null) => void
): FileOpenProps {
  return {
    onClick: () => {
      document.getElementById("file-open")?.click()
    },
    onOpenFile: (e: { target: HTMLInputElement }) => {
      let file = e.target.files?.[0]
      if (!file) {
        return
      }

      openFn(file.name, file)
    },
  }
}

export async function askBeforeOpenIf(
  askFn: () => boolean,
  path: string | null
): Promise<boolean> {
  if (askFn()) {
    return window.confirm(
      "Unsaved changes may be lost. Are you sure you want to " +
        (path ? `open ${path}` : "close this document") +
        "?"
    )
  }
  return true
}

export async function saveFile(
  name: string | null,
  directory: string | null,
  content: string
): Promise<[string | null, string] | null> {
  const filename = name || "alleycat-export.rtf"
  const blob = new Blob([content], { type: "text/rtf" })
  const link = window.document.createElement("a")
  link.style.display = "none"
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  return [null, filename]
}

export async function getFileContents(
  path: string,
  file: File | null
): Promise<string> {
  return await file!.text()
}

export async function ensureSettingsStorage() {}

export async function getSetting<K extends keyof Settings>(
  key: K
): Promise<Settings[K]> {
  let val = window.localStorage.getItem(key)
  if (val === null) {
    return defaultSettings[key]
  }
  return JSON.parse(val)
}

export async function setSetting<K extends keyof Settings>(
  key: K,
  val: Settings[K]
): Promise<void> {
  window.localStorage.setItem(key, JSON.stringify(val))
}

export { usePloverLink } from "src/platform/base"
