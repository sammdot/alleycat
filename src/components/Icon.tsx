import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import {
  faArrowLeft,
  faAsterisk,
  faBold,
  faDownload,
  faEye,
  faFileCirclePlus,
  faFileLines,
  faFilePdf,
  faFolderOpen,
  faHighlighter,
  faItalic,
  faPencil,
  faPenToSquare,
  faRotateLeft,
  faRotateRight,
  faSliders,
  faUnderline,
  faUpload,
} from "@fortawesome/free-solid-svg-icons"

const Icon = (name: IconProp) => () => <FontAwesomeIcon icon={name} />

export const BackIcon = Icon(faArrowLeft)
export const BoldIcon = Icon(faBold)
export const EditIcon = Icon(faPenToSquare)
export const ExportASCIIIcon = Icon(faFileLines)
export const ExportPDFIcon = Icon(faFilePdf)
export const ItalicIcon = Icon(faItalic)
export const NewIcon = Icon(faFileCirclePlus)
export const OpenIcon = Icon(faFolderOpen)
export const PloverIcon = Icon(faAsterisk)
export const PreviewIcon = Icon(faEye)
export const RedoIcon = Icon(faRotateRight)
export const ReviewIcon = Icon(faHighlighter)
export const SaveIcon = Icon(faDownload)
export const SettingsIcon = Icon(faSliders)
export const TranslateIcon = Icon(faPencil)
export const UnderlineIcon = Icon(faUnderline)
export const UndoIcon = Icon(faRotateLeft)
export const UploadIcon = Icon(faUpload)
