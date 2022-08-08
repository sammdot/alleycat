import { useMemo } from "react"
import { Editor as TiptapEditor } from "@tiptap/core"

import { StrokeMap, PositionMap } from "src/hooks/notes"
import { formatSteno, StenoTable } from "src/models/steno"

type Props = {
  editor: TiptapEditor
  stenoTable: StenoTable
  strokes: StrokeMap
  positions: PositionMap
  selection: string[]
  showNumbers: boolean
}

export function StenoNotesView({
  editor,
  stenoTable,
  strokes,
  positions,
  selection,
  showNumbers,
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
    <div className="bg-amber-50 dark:bg-gray-700 border-l dark:border-gray-400 shrink-0 basis-72 p-1 font-mono tracking-wider text-center whitespace-pre select-none h-full overflow-x-hidden overflow-y-scroll">
      {sortedStrokes.map((strk) => {
        return (
          <div
            key={strk.timestamp.toString()}
            className="hover:bg-amber-100 active:bg-amber-200 dark:hover:bg-brand-800 dark:active:bg-brand-600 dark:text-white select-none rounded cursor-pointer"
            acat-pos={positions[strk.timestamp]}
            data-state={
              selection.includes(strk.timestamp.toString()) ? "on" : undefined
            }
            onClick={() => highlightTranslationAt(positions[strk.timestamp])}
          >
            {formatSteno(strk.steno, stenoTable, showNumbers) || "<INVALID>"}
          </div>
        )
      })}
    </div>
  )
}
