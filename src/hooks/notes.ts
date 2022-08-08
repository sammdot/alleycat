import { Node } from "prosemirror-model"
import { Selection, Transaction } from "prosemirror-state"
import { useCallback, useState } from "react"
import { Editor } from "@tiptap/core"

import { replacedRanges } from "src/utils/transform"

export type Stroke = {
  steno: string
  timestamp: number
}

export type StrokeMap = { [key: string]: Stroke }
export type PositionMap = { [key: string]: number }

export function getSelectedStrokes(editor: Editor): string[] | null {
  const { $from, $to } = editor.state.selection
  let nodes: Node[] = []
  editor.state.doc.nodesBetween($from.pos, $to.pos, (node) => {
    if (node.type.name !== "translation") {
      return
    }
    nodes.push(node)
  })
  if (nodes.length !== 1) {
    return null
  }

  const node = nodes[0]
  let strokes: string[] = []
  node.descendants((n) => {
    if (n.type.name !== "stroke") {
      return
    }
    strokes.push(n.attrs.steno)
  })

  if (strokes.length === 0) {
    return null
  }

  return strokes
}

export function useNotes(): any {
  const [strokes, setStrokes] = useState<StrokeMap>({})
  const [selection, setSelection] = useState<string[]>([])
  const [positions, setPositions] = useState<PositionMap>({})

  const updateNotes = useCallback(
    (doc: Node, tr: Transaction) => {
      if (tr.steps.length === 0) {
        return
      }

      setPositions((prev) => {
        let next: PositionMap = structuredClone(prev)
        Array.from(Object.entries(next)).forEach(([timestamp, position]) => {
          next[timestamp] = tr.mapping.map(position)
        })
        return next
      })

      replacedRanges(tr).forEach(({ from, to }) => {
        let newStrokes: {
          steno: string
          timestamp: number
          position: number
        }[] = []

        doc.nodesBetween(from, to, (node, pos) => {
          if (node.type.name !== "stroke") {
            return
          }

          newStrokes.push({
            steno: node.attrs.steno,
            timestamp: node.attrs.timestamp,
            position: pos,
          })
        })

        setStrokes((prev) => {
          let next = structuredClone(prev)
          newStrokes.forEach(({ steno, timestamp }) => {
            next[timestamp] = { steno, timestamp }
          })
          return next
        })
        setPositions((prev) => {
          let next = structuredClone(prev)
          newStrokes.forEach(({ timestamp, position }) => {
            next[timestamp] = position
          })
          return next
        })
      })
    },
    [setStrokes, setPositions]
  )

  const updateSelection = useCallback(
    (doc: Node, sel: Selection) => {
      let { from, to } = sel
      let selected: string[] = []
      doc.nodesBetween(from, to, (node) => {
        if (node.type.name !== "translation") {
          return
        }

        node.descendants((n) => {
          if (n.type.name !== "stroke") {
            return
          }
          selected.push(n.attrs.timestamp)
        })
      })

      setSelection(selected)
    },
    [setSelection]
  )

  return { strokes, positions, selection, updateNotes, updateSelection }
}
