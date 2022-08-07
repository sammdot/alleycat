export const desktop = !!process.env.REACT_APP_DESKTOP

const platform = process.env.REACT_APP_DESKTOP
  ? require("src/platform/tauri")
  : require("src/platform/web")

export const showError = platform.showError
export const setTitle = platform.setTitle
export const splitPath = platform.splitPath
export const windowDragAreaProps = platform.windowDragAreaProps
export const usePreventClose = platform.usePreventClose
export const useFileDrop = platform.useFileDrop
export const useOpenDialog = platform.useOpenDialog
export const askBeforeOpenIf = platform.askBeforeOpenIf
export const saveFile = platform.saveFile
export const getFileContents = platform.getFileContents
