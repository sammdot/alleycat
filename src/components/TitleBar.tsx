import { Document } from "src/models/document"
import logo from "src/logo.svg"

type Props = {
  document: Document
}

export function TitleBar({ document }: Props) {
  return (
    <div className="w-full p-4 pb-2 flex flex-row content-center">
      <img src={logo} alt="AlleyCAT" className="h-8 mr-4 select-none" />
      <div className="px-2 pt-1">
        {document.name ? (
          <>
            {document.path && (
              <span className="text-gray-400">{document.path}</span>
            )}
            {document.name}
          </>
        ) : (
          <span className="text-gray-400 italic">untitled.rtf</span>
        )}
      </div>
    </div>
  )
}
