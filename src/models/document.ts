import { Node } from "prosemirror-model"

export interface Document {
  name: string | null
  path: string | null
  local: boolean
  rtfContent: string | null
  content: any | null
}
