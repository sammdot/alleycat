import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBold,
  faItalic,
  faRotateLeft,
  faRotateRight,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons"

export function BoldIcon() {
  return <FontAwesomeIcon icon={faBold} />
}

export function ItalicIcon() {
  return <FontAwesomeIcon icon={faItalic} />
}

export function RedoIcon() {
  return <FontAwesomeIcon icon={faRotateRight} />
}

export function UnderlineIcon() {
  return <FontAwesomeIcon icon={faUnderline} />
}

export function UndoIcon() {
  return <FontAwesomeIcon icon={faRotateLeft} />
}
