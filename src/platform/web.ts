import { Dispatch, SetStateAction } from "react"
import { useBeforeunload } from "react-beforeunload"

export function showError(err: string, title: string) {
  alert(err)
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

export function usePreventClose(preventFn: () => boolean) {
  useBeforeunload((e: any) => {
    if (preventFn()) {
      e.preventDefault()
    }
  })
}

export function useFileDrop(
  setDragging: Dispatch<SetStateAction<boolean>>,
  fileDropped: (path: string, file: File | null) => void
): {
  onDragOver: (e: DragEvent) => void
  onDragEnter: (e: DragEvent) => void
  onDragLeave: (e: DragEvent) => void
  onDrop: (e: DragEvent) => void
} {
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

export async function useOpenDialog(
  openFn: (path: string, file: File | null) => void
): Promise<{
  onClick: () => void
  onOpenFile: (e: { target: HTMLInputElement }) => void
}> {
  document.getElementById("file-open")?.click()

  const onOpenFile = (e: { target: HTMLInputElement }) => {
    let file = e.target.files?.[0]
    if (!file) {
      return
    }

    openFn(file.name, file)
  }

  return {
    onClick: () => {
      document.getElementById("file-open")?.click()
    },
    onOpenFile,
  }
}

export async function askBeforeOpenIf(
  askFn: () => boolean,
  path: string
): Promise<boolean> {
  if (askFn()) {
    return window.confirm(
      `Unsaved changes may be lost. Are you sure you want to open ${path}?`
    )
  }
  return true
}

export async function saveFile(
  name: string | null,
  directory: string | null,
  content: string
): Promise<void> {
  const filename = name || "alleycat-export.rtf"
  const blob = new Blob([content], { type: "text/rtf" })
  const link = window.document.createElement("a")
  link.style.display = "none"
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

export async function getFileContents(
  path: string,
  file: File | null
): Promise<string> {
  return await file!.text()
}
