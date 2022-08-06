import { JSONContent } from "@tiptap/core"

export type Content = JSONContent

export enum DocumentType {
  transcript = "transcript",
  notes = "notes",
  dictionary = "dictionary",
  globalTable = "global table",
  fixedTranscript = "fixed format",
}

export interface Metadata {
  rtfcreVersion: number
  systemName: string | null
  docType: DocumentType
}

export interface Document {
  name: string | null
  path: string | null
  metadata: Metadata
  content: Content
}

export const defaultMetadata: Metadata = {
  rtfcreVersion: 100,
  systemName: "AlleyCAT",
  docType: DocumentType.transcript,
}
