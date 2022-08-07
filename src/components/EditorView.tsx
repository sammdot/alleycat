import { EditorContent } from "@tiptap/react"
import "src/components/EditorView.css"

type Props = {
  editor: any
}

export function EditorView({ editor }: Props) {
  return (
    <div className="grow">
      <EditorContent
        editor={editor}
        className="h-full overflow-x-hidden overflow-y-scroll"
      />
    </div>
  )
}
