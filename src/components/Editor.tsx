import deepEqual from "deep-equal"
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react"
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
import { Content } from "src/models/document"
import { StenoTable } from "src/models/steno"

type Props = {
  content: Content
  stenoTable: StenoTable
  setSaved: Dispatch<SetStateAction<boolean>>
  saveWebDocument: (content: Content) => void
  saveLocalDocument: (content: Content) => void
}

export function Editor({
  content,
  stenoTable,
  setSaved,
  saveWebDocument,
  saveLocalDocument,
}: Props) {
  const [loaded, setLoaded] = useState<boolean>(false)
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
      if (tr.steps.length !== 0) {
        setSaved(deepEqual(content, editor.state.doc.toJSON()))
      }
    },
  })

  useEffect(() => {
    if (!editor) {
      return
    }
    if (loaded) {
      return
    }
    editor.chain().setContent(content).focus().run()
    setLoaded(true)
    setSaved(true)
  }, [content, editor, loaded, setLoaded, setSaved])

  const saveDocument = useCallback(
    (local: boolean) => {
      if (!editor) {
        return
      }
      const content: Content = editor.getJSON()
      if (local) {
        saveLocalDocument(content)
      } else {
        saveWebDocument(content)
      }
      setSaved(true)
    },
    [editor, saveLocalDocument, saveWebDocument, setSaved]
  )

  return (
    <>
      {editor && (
        <>
          <InlineToolbar editor={editor} />
          <MainToolbar
            editor={editor}
            mode={mode}
            setMode={setMode}
            saveDocument={saveDocument}
          />
        </>
      )}
      <div className="flex flex-row h-[calc(100vh_-_6.25rem)]">
        {editor ? (
          <>
            {mode === "edit" ? (
              <>
                <EditorView editor={editor} />
                <StenoNotesView
                  editor={editor}
                  stenoTable={stenoTable}
                  strokes={strokes}
                  positions={positions}
                  selection={selection}
                />
              </>
            ) : (
              <>
                <div className="bg-gray-50 dark:bg-gray-700 w-full h-full center flex flex-row justify-center items-center">
                  <div className="italic text-gray-400 dark:text-gray-500 select-none">
                    Sorry, {mode} mode is not yet supported.
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="bg-gray-50 dark:bg-gray-700 w-full h-full center flex flex-row justify-center items-center">
              <div className="italic text-gray-400 dark:text-gray-500 select-none">
                Loading editor...
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
