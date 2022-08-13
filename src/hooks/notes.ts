import { Node } from "prosemirror-model"
import { Selection, Transaction } from "prosemirror-state"
import { useCallback, useState } from "react"
import { Editor } from "@tiptap/core"

import { allNodesNamed, childrenNamed } from "src/utils/node"

export type Stroke = {
  steno: string
  timestamp: number
}

export type StrokeMap = { [key: string]: Stroke }
export type PositionMap = { [key: string]: { from: number; to: number } }

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

      let translations: [
        { from: number; to: number },
        { steno: string; timestamp: number }[]
      ][] = allNodesNamed("translation", doc).map(([n, { pos }, size]) => [
        { from: pos, to: pos + size },
        childrenNamed("stroke", n).map((s) => ({
          steno: s.attrs.steno,
          timestamp: s.attrs.timestamp,
        })),
      ])

      setStrokes(() => {
        let map: StrokeMap = {}
        translations.forEach(([{ from, to }, strokes]) => {
          strokes.forEach(({ steno, timestamp }) => {
            map[timestamp.toString()] = { steno, timestamp }
          })
        })
        return map
      })

      setPositions(() => {
        let map: PositionMap = {}
        translations.forEach(([{ from, to }, strokes]) => {
          strokes.forEach(({ steno, timestamp }) => {
            map[timestamp.toString()] = { from, to }
          })
        })
        return map
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
          selected.push(n.attrs.timestamp.toString())
        })
      })

      setSelection(selected)
    },
    [setSelection]
  )

  return { strokes, positions, selection, updateNotes, updateSelection }
}
