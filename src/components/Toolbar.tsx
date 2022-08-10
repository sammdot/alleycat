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
  NewIcon,
  OpenIcon,
  PreviewIcon,
  RedoIcon,
  ReviewIcon,
  SaveIcon,
  UnderlineIcon,
  UndoIcon,
  UploadIcon,
} from "src/components/Icon"
import { PloverMenu } from "src/components/PloverMenu"
import { SettingsMenu } from "src/components/SettingsMenu"
import {
  RadioToggleGroup,
  ToggleGroup,
  ToggleItem,
} from "src/components/ToggleGroup"
import { getSelectedStrokes } from "src/hooks/notes"
import { SettingsHooks } from "src/models/settings"
import { formatStenoInline, StenoTable } from "src/models/steno"
import {
  askBeforeOpenIf,
  canOpenNewWindow,
  openInNewWindow,
  useOpenDialog,
} from "src/platform"
import { PloverLink } from "src/platform/types"

function Button({ label, disabled, onClick, children }: any) {
  return (
    <BaseButton
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="text-sm dark:text-gray-50 disabled:text-slate-400 dark:disabled:text-slate-500 hover:bg-brand-100 dark:hover:bg-brand-700 disabled-hover:bg-transparent open:bg-brand-400 dark:open:bg-brand-500 px-1 py-0.5 rounded"
    >
      {children}
    </BaseButton>
  )
}

function Separator() {
  return (
    <BaseSeparator className="inline border border-gray-200 dark:border-gray-400 mx-2.5" />
  )
}

function Spacer() {
  return <div className="inline grow" />
}

type InlineToolbarProps = {
  editor: any
  stenoTable: StenoTable
  showNumbers: boolean
}

export function InlineToolbar({
  editor,
  stenoTable,
  showNumbers,
}: InlineToolbarProps) {
  let selectedOutline = getSelectedStrokes(editor)
    ?.map((strk) => formatStenoInline(strk, stenoTable, showNumbers))
    .join("/")
  return (
    <BubbleMenu editor={editor}>
      <Toolbar className="bg-white dark:bg-gray-500 flex p-2 shadow-md rounded-md select-none">
        {selectedOutline && (
          <>
            <span className="font-mono pl-1 pr-0.5 text-gray-500 dark:text-gray-300">
              {selectedOutline}
            </span>
            <Separator />
          </>
        )}
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
  saved: boolean
  saveDocument: (local: boolean) => void
  loadDocument: (path: string, file: File | null) => Promise<void>
  settings: SettingsHooks
  plover: PloverLink
}

export function MainToolbar({
  editor,
  mode,
  setMode,
  saved,
  saveDocument,
  loadDocument,
  settings,
  plover,
}: MainToolbarProps) {
  const { onClick: onClickOpen, onOpenFile } = useOpenDialog(
    (path: string, file: File | null) => {
      if (canOpenNewWindow) {
        openInNewWindow(path)
      } else {
        askBeforeOpenIf(() => !saved, path).then((open: boolean) => {
          if (open) {
            loadDocument(path, file)
          }
        })
      }
    }
  )

  return (
    <Toolbar className="grow-0 shrink flex py-2 px-4 select-none border-b border-gray-200 dark:border-gray-400">
      <div className="space-x-1" aria-label="File management">
        <Button
          label="New"
          onClick={() => {
            if (canOpenNewWindow) {
              openInNewWindow("acat://new")
            } else {
              askBeforeOpenIf(() => !saved, null).then((open: boolean) => {
                if (open) {
                  // TODO
                  // loadDocument("acat://new", null)
                }
              })
            }
          }}
          // TODO: until I've figured out how to implement loading a new doc
          disabled={!canOpenNewWindow}
        >
          <NewIcon />
        </Button>
        <Button label="Open" onClick={onClickOpen}>
          {process.env.ACAT_DESKTOP ? <OpenIcon /> : <UploadIcon />}
        </Button>
        <input
          type="file"
          id="file-open"
          className="opacity-0 hidden"
          accept="text/rtf"
          onChange={onOpenFile}
        />
      </div>
      <Separator />
      <div className="space-x-1" aria-label="Export options">
        <Button label="Save" onClick={saveDocument}>
          <SaveIcon />
        </Button>
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
      <Spacer />
      <PloverMenu plover={plover} />
      <SettingsMenu onMainScreen={false} settings={settings} />
    </Toolbar>
  )
}
