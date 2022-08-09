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

export enum ConnectionState {
  disconnected = "disconnected",
  connecting = "connecting",
  connected = "connected",
}

export type PloverLink = {
  canConnect: boolean
  connectionState: ConnectionState
  connect: () => void
  disconnect: () => void
}

type OutputItem =
  | { string: string }
  | { backspaces: number }
  | { key_combo: string }

export interface PloverLinkData {
  stroked: string
  sent: OutputItem[]
}
