import { useOpenDialog, windowDragAreaProps } from "src/platform"
import logo from "src/logo.svg"

type Props = {
  documentLoaded: boolean
  createEmptyDocument: () => void
  loadDocument: (path: string, file: File | null) => void
}

export function MainScreen({
  documentLoaded,
  createEmptyDocument,
  loadDocument,
}: Props) {
  const { onClick, onOpenFile } = useOpenDialog(loadDocument)

  return (
    <>
      <div
        {...windowDragAreaProps}
        className="w-full h-full grow flex flex-col justify-center items-center select-none"
      >
        <img src={logo} alt="AlleyCAT" className="h-16" />
        <div className="mt-2 text-sm text-gray-400 dark:text-gray-500">
          v{process.env.ACAT_VERSION}
        </div>
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
              onClick={onClick}
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
              onChange={onOpenFile}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
