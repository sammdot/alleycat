import { useState } from "react"
import Bold from "@tiptap/extension-bold"
import BubbleMenu from "@tiptap/extension-bubble-menu"
import Document from "@tiptap/extension-document"
import Highlight from "@tiptap/extension-highlight"
import History from "@tiptap/extension-history"
import Italic from "@tiptap/extension-italic"
import Text from "@tiptap/extension-text"
import TextStyle from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import { Editor as TiptapEditor } from "@tiptap/core"
import { useEditor } from "@tiptap/react"

import { EditorView } from "src/components/EditorView"
import { StenoNotesView } from "src/components/StenoNotesView"
import { InlineToolbar, MainToolbar } from "src/components/Toolbar"
import { Paragraph } from "src/extensions/paragraph"
import { Stroke, Translation } from "src/extensions/steno"
import { useNotes } from "src/hooks/notes"

export function Editor() {
  const [mode, setMode] = useState<string>("edit")
  const { strokes, positions, selection, updateNotes, updateSelection } =
    useNotes()

  const editor: TiptapEditor | null = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      TextStyle,
      BubbleMenu,
      History,
      Bold,
      Italic,
      Underline,
      Highlight,
      Stroke,
      Translation,
    ],
    autofocus: false,
    enableInputRules: false,
    enablePasteRules: false,
    onSelectionUpdate({ editor }) {
      updateSelection(editor.state.doc, editor.state.selection)
    },
    onTransaction({ editor, transaction: tr }) {
      updateNotes(editor.state.doc, tr)
    },
  })

  ;(window as any).editor = editor

  return (
    <>
      {editor && (
        <>
          <InlineToolbar editor={editor} />
          <MainToolbar editor={editor} mode={mode} setMode={setMode} />
        </>
      )}
      <div className="flex flex-row h-full">
        {editor ? (
          <>
            {mode === "edit" ? (
              <>
                <EditorView editor={editor} />
                <StenoNotesView
                  editor={editor}
                  strokes={strokes}
                  positions={positions}
                  selection={selection}
                />
              </>
            ) : (
              <>
                <div className="bg-gray-50 w-full h-full center flex flex-row justify-center items-center">
                  <div className="italic text-gray-400 select-none">
                    Sorry, {mode} mode is not yet supported.
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="bg-gray-50 w-full h-full center flex flex-row justify-center items-center">
              <div className="italic text-gray-400 select-none">
                Loading document...
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
