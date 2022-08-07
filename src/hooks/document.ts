import { useState } from "react"

import { Content, defaultDocument, Document } from "src/models/document"
import { fromRTF, toRTF } from "src/models/rtf"
import { getFileContents, saveFile, showError, splitPath } from "src/platform"

export function useDocument(): any {
  const [loaded, setLoaded] = useState<boolean>(true)
  const [document, setDocument] = useState<Document | null>(null)

  const createEmptyDocument = () => {
    setDocument(defaultDocument)
    setLoaded(true)
  }

  const updateDocumentState = (content: Content) => {
    setDocument((prev) => {
      let next = structuredClone(prev)
      next.content = content
      return next
    })
  }

  const loadDocument = async (path: string, file: File | null) => {
    setLoaded(false)

    try {
      const text = await getFileContents(path, file)
      const [content, metadata] = await fromRTF(text)

      const [dir, basename] = await splitPath(path)
      setDocument({
        name: basename,
        path: dir,
        metadata,
        content,
      })
    } catch (err) {
      setLoaded(true)
      showError(err, "Error loading document")
    }
  }

  const saveDocument = async (content: Content) => {
    if (!document || !document.metadata) {
      return
    }

    try {
      const fileContent = await toRTF(content, document.metadata)
      const newFilename = await saveFile(
        document.name,
        document.path,
        fileContent
      )

      if (!!newFilename) {
        const [dir, basename] = newFilename
        setDocument((prev) => {
          let next = structuredClone(prev)
          next.name = basename
          next.path = dir
          return next
        })
      }

      updateDocumentState(content)
    } catch (err) {
      showError(err, "Error saving document")
    }
  }

  return {
    documentLoaded: loaded,
    document,
    createEmptyDocument,
    // loadWebDocument,
    // loadLocalDocument,
    loadDocument,
    saveDocument,
  }
}
