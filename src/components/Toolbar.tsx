import { Dispatch, SetStateAction } from "react"
import { BubbleMenu } from "@tiptap/react"
import {
  Button as BaseButton,
  Separator as BaseSeparator,
  Root as Toolbar,
} from "@radix-ui/react-toolbar"

import {
  BoldIcon,
  EditIcon,
  ExportASCIIIcon,
  ExportPDFIcon,
  ItalicIcon,
  PreviewIcon,
  RedoIcon,
  ReviewIcon,
  SaveIcon,
  UnderlineIcon,
  UndoIcon,
} from "src/components/Icon"
import {
  RadioToggleGroup,
  ToggleGroup,
  ToggleItem,
} from "src/components/ToggleGroup"
import { tauri } from "src/utils/tauri"

function Button({ label, disabled, onClick, children }: any) {
  return (
    <BaseButton
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="text-sm disabled:text-slate-400 hover:bg-brand-100 disabled-hover:bg-transparent px-1 py-0.5 rounded"
    >
      {children}
    </BaseButton>
  )
}

function Separator() {
  return <BaseSeparator className="inline border border-gray-200 mx-2.5" />
}

type InlineToolbarProps = {
  editor: any
}

export function InlineToolbar({ editor }: InlineToolbarProps) {
  return (
    <BubbleMenu editor={editor}>
      <Toolbar className="bg-white flex p-2 shadow-md rounded-md">
        <ToggleGroup
          label="Text formatting"
          value={{
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            underline: editor.isActive("underline"),
          }}
          onToggle={{
            bold: () => editor.chain().focus().toggleBold().run(),
            italic: () => editor.chain().focus().toggleItalic().run(),
            underline: () => editor.chain().focus().toggleUnderline().run(),
          }}
        >
          <ToggleItem name="bold" label="Bold">
            <BoldIcon />
          </ToggleItem>
          <ToggleItem name="italic" label="Italic">
            <ItalicIcon />
          </ToggleItem>
          <ToggleItem name="underline" label="Underline">
            <UnderlineIcon />
          </ToggleItem>
        </ToggleGroup>
      </Toolbar>
    </BubbleMenu>
  )
}

type MainToolbarProps = {
  editor: any
  mode: string
  setMode: Dispatch<SetStateAction<string>>
  saveDocument: (local: boolean) => void
}

export function MainToolbar({
  editor,
  mode,
  setMode,
  saveDocument,
}: MainToolbarProps) {
  return (
    <Toolbar className="grow-0 shrink flex py-2 px-4 border-b border-gray-200">
      <div className="space-x-1" aria-label="Export options">
        {tauri ? (
          <Button label="Save" onClick={() => saveDocument(true)}>
            <SaveIcon />
          </Button>
        ) : (
          <Button label="Download" onClick={() => saveDocument(false)}>
            <SaveIcon />
          </Button>
        )}
        <Button label="Export to ASCII" disabled>
          <ExportASCIIIcon />
        </Button>
        <Button label="Export to PDF" disabled>
          <ExportPDFIcon />
        </Button>
      </div>
      <Separator />
      <RadioToggleGroup
        label="Display modes"
        value={mode}
        onToggle={(val) => setMode(val)}
      >
        <ToggleItem name="edit" label="Edit">
          <EditIcon />
        </ToggleItem>
        <ToggleItem name="review" label="Review">
          <ReviewIcon />
        </ToggleItem>
        <ToggleItem name="preview" label="Preview">
          <PreviewIcon />
        </ToggleItem>
      </RadioToggleGroup>
      {mode === "edit" && (
        <>
          <Separator />
          <div className="space-x-1">
            <Button
              label="Undo"
              onClick={() => editor.chain().undo().run()}
              disabled={!editor.can().undo()}
            >
              <UndoIcon />
            </Button>
            <Button
              label="Redo"
              onClick={() => editor.chain().redo().run()}
              disabled={!editor.can().redo()}
            >
              <RedoIcon />
            </Button>
          </div>
          <Separator />
          <RadioToggleGroup
            label="Paragraph style"
            value={editor.getAttributes("paragraph").style}
            onToggle={(val) =>
              editor.chain().focus().setParagraphStyle(val).run()
            }
          >
            <ToggleItem name="normal" label="Normal">
              N
            </ToggleItem>
            <ToggleItem name="question" label="Question">
              Q.
            </ToggleItem>
            <ToggleItem name="answer" label="Answer">
              A.
            </ToggleItem>
            <ToggleItem name="colloquy" label="Colloquy">
              Cq:
            </ToggleItem>
            <ToggleItem name="byline" label="Byline">
              By
            </ToggleItem>
            <ToggleItem name="centered" label="Centered">
              Ctr
            </ToggleItem>
            <ToggleItem name="paren" label="Parenthetical">
              (P)
            </ToggleItem>
            <ToggleItem name="quoted" label="Quoted">
              "Q"
            </ToggleItem>
          </RadioToggleGroup>
        </>
      )}
    </Toolbar>
  )
}
