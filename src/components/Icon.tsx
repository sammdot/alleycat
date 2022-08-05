import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBold,
  faEye,
  faHighlighter,
  faItalic,
  faPenToSquare,
  faRotateLeft,
  faRotateRight,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons"

export function BoldIcon() {
  return <FontAwesomeIcon icon={faBold} />
}

export function EditIcon() {
  return <FontAwesomeIcon icon={faPenToSquare} />
}

export function ItalicIcon() {
  return <FontAwesomeIcon icon={faItalic} />
}

export function PreviewIcon() {
  return <FontAwesomeIcon icon={faEye} />
}

export function RedoIcon() {
  return <FontAwesomeIcon icon={faRotateRight} />
}

export function ReviewIcon() {
  return <FontAwesomeIcon icon={faHighlighter} />
}

export function UnderlineIcon() {
  return <FontAwesomeIcon icon={faUnderline} />
}

export function UndoIcon() {
  return <FontAwesomeIcon icon={faRotateLeft} />
}
