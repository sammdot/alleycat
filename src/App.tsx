import React from "react"

import { Editor } from "src/components/Editor"
import { MainScreen } from "src/components/MainScreen"
import { TitleBar } from "src/components/TitleBar"
import { useDocument } from "src/hooks/document"

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

  return (
    <>
      {document && documentLoaded ? (
        <>
          <TitleBar document={document} />
          <div className="flex flex-col">
            <Editor
              content={document.content}
              stenoTable={document.metadata.stenoTable}
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
