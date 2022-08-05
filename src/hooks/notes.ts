import { Node } from "prosemirror-model"
import { Transaction } from "prosemirror-state"
import { useCallback, useState } from "react"

import { replacedRanges } from "src/utils/transform"

export type Stroke = {
  steno: string
  timestamp: number
}

export type StrokeMap = { [key: string]: Stroke }
export type PositionMap = { [key: string]: number }

export function useNotes(): any {
  const [strokes, setStrokes] = useState<StrokeMap>({})
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

  return [strokes, positions, { updateNotes }]
}
