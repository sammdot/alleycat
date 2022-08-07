import { useMemo, useState } from "react"

import { Editor } from "src/components/Editor"
import { MainScreen } from "src/components/MainScreen"
import { TitleBar } from "src/components/TitleBar"
import { useDocument } from "src/hooks/document"
import { useTitle } from "src/hooks/window"
import { askBeforeOpenIf, useFileDrop, usePreventClose } from "src/platform"

function App() {
  const {
    documentLoaded,
    document,
    createEmptyDocument,
    loadDocument,
    saveDocument,
  } = useDocument()

  const [dragging, setDragging] = useState<boolean>(false)
  const [saved, setSaved] = useState<boolean>(false)

  const title = useMemo(() => document?.name || null, [document])
  useTitle(title)

  usePreventClose(() => document && !saved)

  const fileDropProps = useFileDrop(
    setDragging,
    (path: string, file: File | null) => {
      askBeforeOpenIf(() => document && !saved, path).then((open: boolean) => {
        if (open) {
          loadDocument(path, file)
        }
      })
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
