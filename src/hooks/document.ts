import { useState } from "react"

import { Content, defaultDocument, Document } from "src/models/document"
import { fromRTF, toRTF } from "src/models/rtf"
import {
  pathSeparator,
  readFile,
  splitPath,
  saveFile,
  saveDialog,
  showError,
} from "src/utils/tauri"

export function useDocument(): any {
  const [loaded, setLoaded] = useState<boolean>(true)
  const [document, setDocument] = useState<Document | null>(null)

  const createEmptyDocument = () => {
    setDocument(defaultDocument)
    setLoaded(true)
  }

  const loadWebDocument = (file: File) => {
    setLoaded(false)
    file
      .text()
      .then((text) => {
        return fromRTF(text).then(([content, metadata]) => {
          setDocument({
            name: file.name,
            path: null,
            metadata,
            content,
          })
          setLoaded(true)
        })
      })
      .catch((err) => {
        setLoaded(true)
        alert(err)
      })
  }

  const loadLocalDocument = (path: string) => {
    setLoaded(false)
    splitPath(path)
      .then(([dir, basename]) => {
        return readFile(path).then((text) => {
          return fromRTF(text).then(([content, metadata]) => {
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
      .catch((err) => {
        setLoaded(true)
        showError(err, "Error loading document")
      })
  }

  const saveDocument = (content: Content) => {
    setDocument((prev) => {
      let next = structuredClone(prev)
      next.content = content
      return next
    })
  }

  const saveWebDocument = (content: Content) => {
    if (!document || !document.metadata) {
      return
    }

    toRTF(content, document.metadata)
      .then((fileContent) => {
        const filename = document.name || "alleycat-export"
        const blob = new Blob([fileContent], { type: "text/rtf" })
        const link = window.document.createElement("a")
        link.style.display = "none"
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
      })
      .catch((err) => {
        alert(err)
      })
      .then(() => saveDocument(content))
  }

  const saveLocalDocument = (content: Content) => {
    if (!document || !document.metadata) {
      return
    }

    toRTF(content, document.metadata)
      .then((fileContent) => {
        if (document.path && document.name) {
          return saveFile(document.path + document.name, fileContent)
        } else {
          return saveDialog().then((path) => {
            return splitPath(path).then(([dir, basename]) => {
              return saveFile(path, fileContent).then(() => {
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
      .catch((err) => {
        showError(err, "Error saving document")
      })
      .then(() => saveDocument(content))
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
