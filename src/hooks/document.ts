import { useState } from "react"

import { Document } from "src/models/document"
import { pathSeparator, readFile, splitPath } from "src/utils/tauri"

export function useDocument(): any {
  const [loaded, setLoaded] = useState<boolean>(true)
  const [document, setDocument] = useState<Document | null>(null)

  const createEmptyDocument = () => {
    setDocument({
      name: null,
      path: null,
      local: false,
      rtfContent: null,
      content: null,
    })
    setLoaded(true)
  }

  // TODO: Handle parsing RTF and encodings

  const loadWebDocument = (file: File) => {
    setLoaded(false)
    file.text().then((text) => {
      setDocument({
        name: file.name,
        path: null,
        local: false,
        rtfContent: text,
        content: text,
      })
      setLoaded(true)
    })
  }

  const loadLocalDocument = (path: string) => {
    setLoaded(false)
    splitPath(path).then(([dir, basename]) => {
      readFile(path).then((text) => {
        setDocument({
          name: basename,
          path: dir + pathSeparator,
          local: true,
          rtfContent: text,
          content: text,
        })
        setLoaded(true)
      })
    })
  }

  return {
    documentLoaded: loaded,
    document,
    createEmptyDocument,
    loadWebDocument,
    loadLocalDocument,
  }
}
