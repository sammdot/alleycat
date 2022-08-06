import { useState } from "react"

import { Content, defaultMetadata, Document } from "src/models/document"
import { fromRTF, toRTF } from "src/models/rtf"
import {
  pathSeparator,
  readFile,
  splitPath,
  saveFile,
  saveDialog,
} from "src/utils/tauri"

export function useDocument(): any {
  const [loaded, setLoaded] = useState<boolean>(true)
  const [document, setDocument] = useState<Document | null>(null)

  const createEmptyDocument = () => {
    setDocument({
      name: null,
      path: null,
      metadata: defaultMetadata,
      content: { type: "doc", content: [] },
    })
    setLoaded(true)
  }

  const loadWebDocument = (file: File) => {
    setLoaded(false)
    file.text().then((text) => {
      fromRTF(text).then(([content, metadata]) => {
        setDocument({
          name: file.name,
          path: null,
          metadata,
          content,
        })
        setLoaded(true)
      })
    })
  }

  const loadLocalDocument = (path: string) => {
    setLoaded(false)
    splitPath(path).then(([dir, basename]) => {
      readFile(path).then((text) => {
        fromRTF(text).then(([content, metadata]) => {
          setDocument({
            name: basename,
            path: dir + pathSeparator,
            metadata,
            content,
          })
          setLoaded(true)
        })
      })
    })
  }

  const saveWebDocument = (content: Content) => {
    if (!document || !document.metadata) {
      return
    }

    toRTF(content, document.metadata).then((fileContent) => {
      const filename = document.name || "alleycat-export"
      const blob = new Blob([fileContent], { type: "text/rtf" })
      const link = window.document.createElement("a")
      link.style.display = "none"
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
    })
  }

  const saveLocalDocument = (content: Content) => {
    if (!document || !document.metadata) {
      return
    }

    toRTF(content, document.metadata).then((fileContent) => {
      if (document.path && document.name) {
        saveFile(document.path + document.name, fileContent)
      } else {
        saveDialog().then((path) => {
          splitPath(path).then(([dir, basename]) => {
            saveFile(path, fileContent).then(() => {
              setDocument((prev) => {
                let next = structuredClone(prev)
                next.name = basename
                next.path = dir + pathSeparator
                return next
              })
            })
          })
        })
      }
    })
  }

  return {
    documentLoaded: loaded,
    document,
    createEmptyDocument,
    loadWebDocument,
    loadLocalDocument,
    saveWebDocument,
    saveLocalDocument,
  }
}
