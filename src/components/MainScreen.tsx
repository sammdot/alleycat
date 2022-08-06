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

  return (
    <>
      <div
        data-tauri-drag-region
        className="w-full h-full grow flex flex-col justify-center items-center select-none"
      >
        <img src={logo} alt="AlleyCAT" className="h-16 mr-4" />
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
