import * as base from "src/platform/base"

export const desktop = !!process.env.REACT_APP_DESKTOP

let platform = base

if (process.env.ACAT_DESKTOP) {
  let { usePloverLink } = require("src/platform/link")
  platform = {
    usePloverLink,
    ...require("src/platform/tauri"),
  }
}

if (!process.env.ACAT_DESKTOP) {
  platform = require("src/platform/web")
}

export const canOpenNewWindow = platform.canOpenNewWindow
export const showError = platform.showError
export const setTitle = platform.setTitle
export const splitPath = platform.splitPath
export const windowDragAreaProps = platform.windowDragAreaProps
export const useFocusChange = platform.useFocusChange
export const usePreventClose = platform.usePreventClose
export const useFileDrop = platform.useFileDrop
export const useOpenDialog = platform.useOpenDialog
export const openInNewWindow = platform.openInNewWindow
export const askBeforeOpenIf = platform.askBeforeOpenIf
export const saveFile = platform.saveFile
export const getFileContents = platform.getFileContents
export const ensureSettingsStorage = platform.ensureSettingsStorage
export const getSetting = platform.getSetting
export const setSetting = platform.setSetting
export const usePloverLink = platform.usePloverLink
