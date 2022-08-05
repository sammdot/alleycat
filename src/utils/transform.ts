import { Transaction } from "prosemirror-state"
import { ReplaceStep } from "prosemirror-transform"

export function replacedRanges({ steps, mapping }: Transaction) {
  let ranges: { from: number; to: number }[] = []

  steps.forEach((step, i) => {
    let map = mapping.maps[i]
    if (step instanceof ReplaceStep) {
      let { from, to } = step
      ranges.push({ from, to })
    }
    ranges = ranges.map(({ from, to }) => ({
      from: map.map(from, -1),
      to: map.map(to, 1),
    }))
  })

  return ranges
}
