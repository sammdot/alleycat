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
    <div className="w-full h-full flex flex-col justify-start">
      {document && documentLoaded ? (
        <>
          <TitleBar document={document} />
          <div className="grow">
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
    </div>
  )
}

export default App
