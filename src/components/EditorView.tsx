import { EditorContent } from "@tiptap/react"
import "src/components/EditorView.css"

type Props = {
  editor: any
  stenoNotesInline: boolean
}

export function EditorView({ editor, stenoNotesInline }: Props) {
  return (
    <div className={`grow ${stenoNotesInline ? "show-inline-steno" : ""}`}>
      <EditorContent
        editor={editor}
        className="h-full overflow-x-hidden overflow-y-scroll bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 font-mono leading-loose break-words"
      />
    </div>
  )
}
