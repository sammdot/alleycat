import { useEffect, useMemo, useState } from "react"

import { Editor } from "src/components/Editor"
import { MainScreen } from "src/components/MainScreen"
import { TitleBar } from "src/components/TitleBar"
import { useDocument } from "src/hooks/document"
import { useSetting } from "src/hooks/settings"
import { useTitle } from "src/hooks/window"
import {
  askBeforeOpenIf,
  canOpenNewWindow,
  ensureSettingsStorage,
  openInNewWindow,
  useFileDrop,
  usePreventClose,
} from "src/platform"
import { getFileParam } from "src/utils/query"

const root = document.documentElement

function App() {
  const {
    documentLoaded,
    document,
    createEmptyDocument,
    clearDocument,
    loadDocument,
    saveDocument,
  } = useDocument()

  const [dragging, setDragging] = useState<boolean>(false)
  const [saved, setSaved] = useState<boolean>(false)

  const title = useMemo(() => document?.name || null, [document])
  useTitle(title)

  const [fontSize, setFontSize] = useSetting("fontSize")
  useEffect(() => {
    root.style.fontSize = `${fontSize}px`
  }, [fontSize])

  useEffect(() => {
    ensureSettingsStorage()
  })

  const [theme, setTheme] = useSetting("theme")
  useEffect(() => {
    if (theme === "dark") {
      root.classList.add("dark")
    } else if (theme === "light") {
      root.classList.remove("dark")
    }
  }, [theme])
  useEffect(() => {
    if (!!theme) {
      return
    }
    const match = window.matchMedia("(prefers-color-scheme: dark)")
    const handle = () => {
      if (match.matches) root.classList.add("dark")
      else root.classList.remove("dark")
    }
    handle()

    match.addEventListener("change", handle)
    return () => {
      match.removeEventListener("change", handle)
    }
  })

  useEffect(() => {
    if (document) {
      return
    }

    let fileParam = getFileParam()
    if (!fileParam) {
      return
    }

    if (canOpenNewWindow) {
      if (fileParam === "alleycat://new") {
        createEmptyDocument()
      } else {
        loadDocument(fileParam, null)
      }
    }
  }, [createEmptyDocument, document, loadDocument])

  usePreventClose(
    () => document && !saved,
    () => {
      if (!!document) {
        clearDocument()
        ;(window as any).location.search = null
        return false
      }
      return true
    }
  )

  const fileDropProps = useFileDrop(
    setDragging,
    (path: string, file: File | null) => {
      if (!document) {
        loadDocument(path, file)
        return
      }

      if (canOpenNewWindow) {
        openInNewWindow(path)
      } else {
        askBeforeOpenIf(() => document && !saved, path).then(
          (open: boolean) => {
            if (open) {
              loadDocument(path, file)
            }
          }
        )
      }
    }
  )

  return (
    <div className="w-full h-full" {...fileDropProps}>
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
              saveDocument={saveDocument}
              settings={{
                fontSize: [fontSize, setFontSize],
                theme: [theme, setTheme],
              }}
            />
          </div>
        </>
      ) : (
        <MainScreen
          documentLoaded={documentLoaded}
          createEmptyDocument={createEmptyDocument}
          loadDocument={loadDocument}
        />
      )}
    </div>
  )
}

export default App
