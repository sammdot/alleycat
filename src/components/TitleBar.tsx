import { Document } from "src/models/document"
import logo from "src/logo.svg"

type Props = {
  document: Document
}

export function TitleBar({ document }: Props) {
  return (
    <div className="w-full p-4 pb-2 flex flex-row content-center">
      <img src={logo} alt="AlleyCAT" className="h-8 mr-2 select-none" />
      <div className="px-2 pt-1">
        {document.name ? (
          <>
            {document.path && (
              <span className="text-gray-400 text-sm">{document.path}</span>
            )}
            <span className="font-medium">{document.name}</span>
          </>
        ) : (
          <span className="text-gray-400 italic">untitled.rtf</span>
        )}
        <span className="ml-3 px-1 py-0.5 bg-gray-300 text-white rounded text-sm font-semibold">
          <span className="uppercase mr-1">
            {document.metadata.docType.toString()}
          </span>
          v{(document.metadata.rtfcreVersion / 100).toFixed(2)}
        </span>
      </div>
    </div>
  )
}
