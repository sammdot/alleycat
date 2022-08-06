import { useState } from "react"

import { useFileDropEvent } from "src/hooks/window"
import { tauri, openDialog } from "src/utils/tauri"
import logo from "src/logo.svg"

type Props = {
  documentLoaded: boolean
  createEmptyDocument: () => void
  loadWebDocument: (file: File) => void
  loadLocalDocument: (path: string) => void
}

export function MainScreen({
  documentLoaded,
  createEmptyDocument,
  loadWebDocument,
  loadLocalDocument,
}: Props) {
  const [dragging, setDragging] = useState<boolean>(false)

  const showOpenDialog = () => {
    if (tauri) {
      openDialog().then((file) => {
        if (file === null) {
          return
        }
        loadLocalDocument(file)
      })
    } else {
      document.getElementById("file-open")?.click()
    }
  }

  useFileDropEvent(
    (paths) => {
      let files = paths.filter((f: string) => f.endsWith(".rtf"))
      if (files.length !== 1) {
        return
      }
      setDragging(true)
    },
    () => {
      setDragging(false)
    },
    (paths) => {
      setDragging(false)
      let files = paths.filter((f: string) => f.endsWith(".rtf"))
      if (files.length !== 1) {
        return
      }
      loadLocalDocument(files[0]!)
    }
  )

  return (
    <>
      <div
        data-tauri-drag-region
        className="w-full h-full grow flex flex-col justify-center items-center select-none"
        onDragOver={(e) => {
          if (tauri) {
            return
          }
          e.stopPropagation()
          e.preventDefault()
        }}
        onDragEnter={(e) => {
          if (tauri) {
            return
          }
          e.stopPropagation()
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(e) => {
          if (tauri) {
            return
          }
          e.stopPropagation()
          e.preventDefault()
          setDragging(false)
        }}
        onDrop={(e) => {
          if (tauri) {
            return
          }
          e.preventDefault()
          setDragging(false)

          let files = Array.from(e.dataTransfer.items)
            .filter((item) => item.kind === "file")
            .filter((item) => item.type === "text/rtf")
            .map((item) => item.getAsFile())
          if (files.length !== 1) {
            return
          }

          loadWebDocument(files[0]!)
        }}
      >
        {dragging && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center backdrop-blur pointer-events-none">
            <span className="text-center text-gray-800 dark:text-gray-200 text-xl font-semibold mb-12">
              Drag and drop to open
            </span>
          </div>
        )}
        <img src={logo} alt="AlleyCAT" className="h-16" />
        {documentLoaded ? (
          <div className="w-60 flex flex-col space-y-4 mt-8">
            <button
              className="text-center px-4 py-2 rounded-md font-semibold bg-brand-500 text-white hover:bg-brand-600 dark:hover:bg-brand-400 hover:shadow-md"
              onClick={createEmptyDocument}
            >
              New Document
            </button>
            <button
              className="text-center px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-gray-500 dark:text-white dark:hover:bg-gray-400 hover:shadow-md"
              onClick={showOpenDialog}
            >
              Open Document...
            </button>
            <span className="text-center text-gray-800 dark:text-gray-400">
              or drag and drop an .rtf file
            </span>
            <input
              type="file"
              id="file-open"
              className="opacity-0"
              accept="text/rtf"
              onChange={(e) => {
                let file = e.target.files?.[0]
                if (!file) {
                  return
                }

                loadWebDocument(file)
              }}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
