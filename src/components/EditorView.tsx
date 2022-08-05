import { EditorContent } from "@tiptap/react"
import "src/components/EditorView.css"

type Props = {
  editor: any
}

export function EditorView({ editor }: Props) {
  return (
    <div className="flex-1">
      <EditorContent editor={editor} className="h-full w-full flex" />
    </div>
  )
}
