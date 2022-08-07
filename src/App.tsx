import { useMemo, useState } from "react"
import { useBeforeunload } from "react-beforeunload"

import { Editor } from "src/components/Editor"
import { MainScreen } from "src/components/MainScreen"
import { TitleBar } from "src/components/TitleBar"
import { useDocument } from "src/hooks/document"
import { useCloseRequested, useFileDropEvent, useTitle } from "src/hooks/window"
import { confirmClose, confirmOpen, closeWindow, tauri } from "src/utils/tauri"

function App() {
  const {
    documentLoaded,
    document,
    createEmptyDocument,
    loadWebDocument,
    loadLocalDocument,
    saveWebDocument,
    saveLocalDocument,
  } = useDocument()

  const [dragging, setDragging] = useState<boolean>(false)
  const [saved, setSaved] = useState<boolean>(false)

  useBeforeunload((e: any) => {
    if (document && !saved) {
      e.preventDefault()
    }
  })

  useCloseRequested(() => {
    if (saved || !document) {
      closeWindow()
    } else {
      confirmClose()
    }
  })

  const title = useMemo(() => document?.name || null, [document])

  useTitle(title)

  useFileDropEvent(
    (paths) => {
      let files = paths.filter((f: string) => f.endsWith(".rtf"))
      if (files.length !== 1) {
        return
      }
      setDragging(true)
    },
    () => {
      setDragging(false)
    },
    (paths) => {
      setDragging(false)
      let files = paths.filter((f: string) => f.endsWith(".rtf"))
      if (files.length !== 1) {
        return
      }

      let file = files[0]!
      if (document && !saved) {
        confirmOpen(file).then((open) => {
          loadLocalDocument(file)
        })
      } else {
        loadLocalDocument(files[0]!)
      }
    }
  )

  return (
    <div
      className="w-full h-full"
      onDragOver={(e) => {
        if (tauri) {
          return
        }
        e.stopPropagation()
        e.preventDefault()
      }}
      onDragEnter={(e) => {
        if (tauri) {
          return
        }
        e.stopPropagation()
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(e) => {
        if (tauri) {
          return
        }
        e.stopPropagation()
        e.preventDefault()
        setDragging(false)
      }}
      onDrop={(e) => {
        if (tauri) {
          return
        }
        e.preventDefault()
        setDragging(false)

        let files = Array.from(e.dataTransfer.items)
          .filter((item) => item.kind === "file")
          .filter((item) => item.type === "text/rtf")
          .map((item) => item.getAsFile())
        if (files.length !== 1) {
          return
        }

        let file = files[0]!
        if (document && !saved) {
          window.confirm(
            `Unsaved changes may be lost. Are you sure you want to open ${file.name}?`
          )
          return
        }

        loadWebDocument(file)
      }}
    >
      {dragging && (
        <div className="z-[100] fixed top-0 left-0 w-full h-full flex justify-center items-center backdrop-blur pointer-events-none">
          <span className="text-center text-gray-800 dark:text-gray-200 text-xl font-semibold mb-12">
            Drag and drop to open
          </span>
        </div>
      )}
      {document && documentLoaded ? (
        <>
          <TitleBar document={document} saved={saved} />
          <div className="flex flex-col">
            <Editor
              content={document.content}
              stenoTable={document.metadata.stenoTable}
              setSaved={setSaved}
              saveWebDocument={saveWebDocument}
              saveLocalDocument={saveLocalDocument}
            />
          </div>
        </>
      ) : (
        <MainScreen
          documentLoaded={documentLoaded}
          createEmptyDocument={createEmptyDocument}
          loadWebDocument={loadWebDocument}
          loadLocalDocument={loadLocalDocument}
        />
      )}
    </div>
  )
}

export default App
