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
import { PloverLink } from "src/extensions/link"
import { Paragraph } from "src/extensions/paragraph"
import { Action, Stroke, Translation, Untranslate } from "src/extensions/steno"
import { useNotes } from "src/hooks/notes"
import { Content } from "src/models/document"
import { LinkData } from "src/models/link"
import { SettingsHooks } from "src/models/settings"
import { StenoTable } from "src/models/steno"
import { useFocusChange, usePloverLink } from "src/platform"

type Props = {
  content: Content
  stenoTable: StenoTable
  saved: boolean
  setSaved: Dispatch<SetStateAction<boolean>>
  saveDocument: (content: Content) => void
  loadDocument: (path: string, file: File | null) => Promise<void>
  settings: SettingsHooks
}

export function Editor({
  content,
  stenoTable,
  saved,
  setSaved,
  saveDocument,
  loadDocument,
  settings,
}: Props) {
  const [focused, setFocused] = useState<boolean>(true)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [mode, setMode] = useState<string>("edit")
  const { strokes, positions, selection, updateNotes, updateSelection } =
    useNotes()

  const {
    stenoNotesInline: [stenoNotesInline],
    stenoNotesNumbers: [showNumbers],
  } = settings

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
      Action,
      Translation,
      Untranslate,
      PloverLink,
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

  if (process.env.ACAT_DEVEL) {
    ;(window as any).editor = editor
  }

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

  const _saveDocument = useCallback(() => {
    if (!editor) {
      return
    }
    saveDocument(editor.getJSON())
    setSaved(true)
  }, [editor, saveDocument, setSaved])

  useFocusChange(setFocused)

  const ploverHandler = useCallback(
    (data: LinkData) => {
      if (focused) {
        editor?.commands.locateTranslation(data)
      } else {
        editor?.commands.addTranslation(data)
      }
    },
    [editor, focused]
  )
  const plover = usePloverLink(ploverHandler)

  useEffect(() => {
    const { disconnect } = plover
    return () => {
      disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {editor && (
        <>
          <InlineToolbar
            editor={editor}
            stenoTable={stenoTable}
            showNumbers={showNumbers}
          />
          <MainToolbar
            editor={editor}
            mode={mode}
            setMode={setMode}
            saved={saved}
            saveDocument={_saveDocument}
            loadDocument={loadDocument}
            settings={settings}
            plover={plover}
          />
        </>
      )}
      <div className="flex flex-row h-[calc(100vh_-_6.25rem)]">
        {editor ? (
          <>
            {mode === "edit" ? (
              <>
                <EditorView
                  editor={editor}
                  stenoNotesInline={stenoNotesInline}
                />
                <StenoNotesView
                  editor={editor}
                  stenoTable={stenoTable}
                  strokes={strokes}
                  positions={positions}
                  selection={selection}
                  showNumbers={showNumbers}
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
