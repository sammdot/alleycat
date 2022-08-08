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
import { invoke } from "@tauri-apps/api/tauri"
import { appWindow, getAll } from "@tauri-apps/api/window"

import { FileDropProps, FileOpenProps } from "src/platform/types"
import { queryString } from "src/utils/query"

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

export const canOpenNewWindow = true

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

export function usePreventClose(
  preventFn: () => boolean,
  backToMainScreen: () => boolean
) {
  w.onCloseRequested = async () => {
    if (preventFn()) {
      let quit = await ask(
        "Unsaved changes may be lost. Are you sure you want to exit?",
        {
          type: "warning",
        }
      )
      if (!quit) {
        return
      }
    }

    if (getAll().length === 1) {
      if (backToMainScreen()) {
        appWindow.close()
      }
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
      w.onFileDropHover?.(e.payload)
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
    onClick: async () => {
      const selected = await openDialog(fileSelectParams)
      if (selected === null || Array.isArray(selected)) {
        return
      }

      openFn(selected, null)
    },
    onOpenFile: (e) => {},
  }
}

export async function openInNewWindow(path: string) {
  await invoke("new_window", { path: queryString(path) })
}

export async function askBeforeOpenIf(
  askFn: () => boolean,
  path: string
): Promise<boolean> {
  return false
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
