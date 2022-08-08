import * as base from "src/platform/base"

export const desktop = !!process.env.REACT_APP_DESKTOP

let platform = base

if (process.env.ACAT_DESKTOP) {
  platform = require("src/platform/tauri")
}

if (!process.env.ACAT_DESKTOP) {
  platform = require("src/platform/web")
}

export const canOpenNewWindow = platform.canOpenNewWindow
export const showError = platform.showError
export const setTitle = platform.setTitle
export const splitPath = platform.splitPath
export const windowDragAreaProps = platform.windowDragAreaProps
export const usePreventClose = platform.usePreventClose
export const useFileDrop = platform.useFileDrop
export const useOpenDialog = platform.useOpenDialog
export const openInNewWindow = platform.openInNewWindow
export const askBeforeOpenIf = platform.askBeforeOpenIf
export const saveFile = platform.saveFile
export const getFileContents = platform.getFileContents
