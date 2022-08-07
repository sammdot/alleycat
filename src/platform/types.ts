import { DragEvent } from "react"

export type FileDropProps = {
  onDragOver: (e: DragEvent) => void
  onDragEnter: (e: DragEvent) => void
  onDragLeave: (e: DragEvent) => void
  onDrop: (e: DragEvent) => void
}

export type FileOpenProps = {
  onClick: () => void
  onOpenFile: (e: { target: HTMLInputElement }) => void
}
