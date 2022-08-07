import { Dispatch, SetStateAction } from "react"

import { FileDropProps } from "src/platform/types"

export function showError(err: any, title: string) {}

export function setTitle(title: string) {}

export async function splitPath(
  path: string
): Promise<[string | null, string]> {
  return [null, path]
}

export const windowDragAreaProps: any = {}

export function usePreventClose(preventFn: () => boolean) {}

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
