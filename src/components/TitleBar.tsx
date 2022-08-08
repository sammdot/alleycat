import { Document } from "src/models/document"
import { windowDragAreaProps } from "src/platform"
import logo from "src/logo.svg"

type Props = {
  document: Document
  saved: boolean
}

export function TitleBar({ document, saved }: Props) {
  return (
    <div
      {...windowDragAreaProps}
      className="w-full p-4 pb-2 flex flex-row content-center"
    >
      <img src={logo} alt="AlleyCAT" className="h-8 mr-2 select-none" />
      <div className="px-2 pt-1 grow">
        {document.name ? (
          <>
            {document.path && (
              <span className="text-gray-400 text-sm">{document.path}</span>
            )}
            <span className="font-medium dark:text-white">{document.name}</span>
          </>
        ) : (
          <span className="text-gray-400 italic">untitled.rtf</span>
        )}
        <span className="ml-3 px-1.5 py-0.5 bg-gray-400 dark:bg-gray-500 text-white rounded text-sm font-semibold select-none">
          <span className="uppercase mr-1">
            {document.metadata.docType.toString()}
          </span>
          v{(document.metadata.rtfcreVersion / 100).toFixed(2)}
        </span>
        {!saved && (
          <span className="ml-3 inline-block h-2 w-2 rounded bg-amber-400 translate-y-2">
            &nbsp;
          </span>
        )}
      </div>
      <div className="text-sm text-gray-400 select-none">
        v{process.env.ACAT_VERSION}
      </div>
    </div>
  )
}
