import { Dispatch, SetStateAction, useEffect } from "react"
import {
  ask,
  message,
  open as openDialog,
  save as saveDialog,
} from "@tauri-apps/api/dialog"
import { Event } from "@tauri-apps/api/event"
import { readTextFile, writeTextFile } from "@tauri-apps/api/fs"
import { basename, dirname, resolve, sep } from "@tauri-apps/api/path"
import { appWindow } from "@tauri-apps/api/window"

import { FileDropProps, FileOpenProps } from "src/platform/types"

const w: any = window

const pathSeparator = sep

const fileSelectParams = {
  filters: [
    {
      name: "RTF Document",
      extensions: ["rtf"],
    },
  ],
}

export function showError(err: any, title?: string) {
  message(err.toString(), { title, type: "error" })
}

export function setTitle(title: string) {
  appWindow.setTitle(title || "AlleyCAT")
}

export async function splitPath(
  path: string
): Promise<[string | null, string]> {
  const p = await resolve(path)
  const dir = await dirname(p)
  const file = await basename(p)
  return [dir + pathSeparator, file]
}

export const windowDragAreaProps = { "data-tauri-drag-region": true }

export function usePreventClose(preventFn: () => boolean) {
  w.onCloseRequested = () => {
    if (preventFn()) {
      ask("Unsaved changes may be lost. Are you sure you want to exit?", {
        type: "warning",
      }).then((quit) => {
        if (quit) {
          appWindow.close()
        }
      })
    } else {
      appWindow.close()
    }
  }

  useEffect(() => {
    appWindow.listen("tauri://close-requested", (e) => {
      w.onCloseRequested?.()
    })
  }, [])
}

export function useFileDrop(
  setDragging: Dispatch<SetStateAction<boolean>>,
  fileDropped: (path: string, file: File | null) => void
): FileDropProps {
  const canOpenFile = (path: string) => path.endsWith(".rtf")

  w.onFileDropHover = (paths: string[]) => {
    if (paths.filter(canOpenFile).length !== 1) {
      return
    }
    setDragging(true)
  }
  w.onFileDropCancel = () => {
    setDragging(false)
  }
  w.onFileDrop = (paths: string[]) => {
    setDragging(false)
    let files = paths.filter(canOpenFile)
    if (files.length !== 1) {
      return
    }

    let file = files[0]!
    fileDropped(file, null)
  }

  useEffect(() => {
    appWindow.listen<Event<string[]>>("tauri://file-drop-hover", (e) => {
      w.onFileDropHover?.()
    })
    appWindow.listen<Event<void>>("tauri://file-drop-cancelled", (e) => {
      w.onFileDropCancel?.()
    })
    appWindow.listen<Event<string[]>>("tauri://file-drop", (e) => {
      w.onFileDrop?.(e.payload)
    })
  }, [])

  return {
    onDragOver: (e) => {},
    onDragEnter: (e) => {},
    onDragLeave: (e) => {},
    onDrop: (e) => {},
  }
}

export function useOpenDialog(
  openFn: (path: string, file: File | null) => void
): FileOpenProps {
  return {
    onClick: () => {
      openDialog(fileSelectParams).then((selected) => {
        if (selected !== null && !Array.isArray(selected)) {
          openFn(selected, null)
        }
      })
    },
    onOpenFile: (e) => {},
  }
}

export async function askBeforeOpenIf(
  askFn: () => boolean,
  path: string
): Promise<boolean> {
  if (askFn()) {
    return await ask(
      `Unsaved changes may be lost. Are you sure you want to open ${path}?`,
      {
        type: "warning",
      }
    )
  }
  return true
}

export async function saveFile(
  name: string | null,
  directory: string | null,
  content: string
): Promise<[string | null, string] | null> {
  if (directory && name) {
    await writeTextFile(directory + name, content)
    return null
  } else {
    const path = await saveDialog(fileSelectParams)
    await writeTextFile(path, content)
    return await splitPath(path)
  }
}

export async function getFileContents(
  path: string,
  file: File | null
): Promise<string> {
  return await readTextFile(path)
}
