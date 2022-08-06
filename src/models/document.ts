import { JSONContent } from "@tiptap/core"

import { defaultStenoTable, StenoTable } from "src/models/steno"

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
  stenoTable: StenoTable
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
  stenoTable: defaultStenoTable,
}

export const defaultContent: Content = {
  type: "doc",
  content: [{ type: "paragraph", attrs: { style: "normal" } }],
}

export const defaultDocument: Document = {
  name: null,
  path: null,
  metadata: defaultMetadata,
  content: defaultContent,
}
