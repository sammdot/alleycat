import { Dispatch, SetStateAction } from "react"

import { defaultSettings, Settings } from "src/models/settings"
import { FileDropProps } from "src/platform/types"

export const canOpenNewWindow = false

export function showError(err: any, title: string) {}

export function setTitle(title: string) {}

export async function splitPath(
  path: string
): Promise<[string | null, string]> {
  return [null, path]
}

export const windowDragAreaProps: any = {}

export function usePreventClose(
  preventFn: () => boolean,
  backToMainScreen: () => boolean
) {}

export function useFileDrop(
  setDragging: Dispatch<SetStateAction<boolean>>,
  fileDropped: (path: string, file: File | null) => void
): FileDropProps {
  return {
    onDragOver: (e) => {},
    onDragEnter: (e) => {},
    onDragLeave: (e) => {},
    onDrop: (e) => {},
  }
}

export function useOpenDialog(
  openFn: (path: string, file: File | null) => void
): {
  onClick: () => void
  onOpenFile: (e: { target: HTMLInputElement }) => void
} {
  return {
    onClick: () => {},
    onOpenFile: () => {},
  }
}

export function useOpenEvent(fn: (path: string, file: File | null) => void) {}

export async function openInNewWindow(path: string) {}

export async function askBeforeOpenIf(
  askFn: () => boolean,
  path: string
): Promise<boolean> {
  return true
}

export async function saveFile(
  name: string | null,
  directory: string | null,
  content: string
): Promise<[string | null, string] | null> {
  return null
}

export async function getFileContents(
  path: string,
  file: File | null
): Promise<string> {
  return ""
}

export async function ensureSettingsStorage() {}

export async function getSetting<K extends keyof Settings>(
  key: K
): Promise<Settings[K]> {
  return defaultSettings[key]
}

export async function setSetting<K extends keyof Settings>(
  key: K,
  val: Settings[K]
): Promise<void> {}
