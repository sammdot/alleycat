import * as base from "src/platform/base"

export const desktop = !!process.env.REACT_APP_DESKTOP

let platform = base

if (process.env.ACAT_DESKTOP) {
  import(/* webpackChunkName: "tauri" */ "src/platform/tauri").then((p) => {
    platform = p
  })
}

if (!process.env.ACAT_DESKTOP) {
  import(/* webpackChunkName: "web" */ "src/platform/web").then((p) => {
    platform = p
  })
}

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
