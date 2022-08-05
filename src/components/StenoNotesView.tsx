import { useMemo } from "react"
import { Editor as TiptapEditor } from "@tiptap/core"

import { StrokeMap, PositionMap } from "src/hooks/notes"

type Props = {
  editor: TiptapEditor
  strokes: StrokeMap
  positions: PositionMap
  selection: string[]
}

export function StenoNotesView({
  editor,
  strokes,
  positions,
  selection,
}: Props) {
  const sortedStrokes = useMemo(
    () => Array.from(Object.values(strokes)).sort((strk) => strk.timestamp),
    [strokes]
  )

  const highlightTranslationAt = (position: number) => {
    let pos = editor.state.doc.resolve(position)
    editor
      .chain()
      .focus()
      .setTextSelection({ from: pos.before(), to: pos.after() })
      .scrollIntoView()
      .run()
  }

  return (
    <div className="bg-amber-50 shrink-0 basis-[270px] p-1 font-mono tracking-wider text-center whitespace-pre select-none">
      {sortedStrokes.map((strk) => {
        return (
          <div
            key={strk.timestamp.toString()}
            className="hover:bg-amber-100 active:bg-amber-200 select-none rounded cursor-pointer"
            acat-pos={positions[strk.timestamp]}
            data-state={
              selection.includes(strk.timestamp.toString()) ? "on" : undefined
            }
            onClick={() => highlightTranslationAt(positions[strk.timestamp])}
          >
            {strk.steno}
          </div>
        )
      })}
    </div>
  )
}
