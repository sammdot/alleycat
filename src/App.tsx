import { useMemo, useState } from "react"
import { useBeforeunload } from "react-beforeunload"

import { Editor } from "src/components/Editor"
import { MainScreen } from "src/components/MainScreen"
import { TitleBar } from "src/components/TitleBar"
import { useDocument } from "src/hooks/document"
import { useCloseRequested, useTitle } from "src/hooks/window"
import { confirmClose, closeWindow } from "src/utils/tauri"

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

  const [saved, setSaved] = useState<boolean>(false)

  useBeforeunload((e: any) => {
    if (!saved) {
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

  return (
    <>
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
    </>
  )
}

export default App
