import React from "react"

import { Editor } from "src/components/Editor"
import { TitleBar } from "src/components/TitleBar"

function App() {
  return (
    <div className="w-full h-full flex flex-col justify-start">
      <TitleBar />
      <div className="grow">
        <Editor />
      </div>
    </div>
  )
}

export default App
