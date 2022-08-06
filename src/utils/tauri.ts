import { ask, message, open, save } from "@tauri-apps/api/dialog"
import { readTextFile, writeTextFile } from "@tauri-apps/api/fs"
import { basename, dirname, resolve, sep } from "@tauri-apps/api/path"
import { appWindow } from "@tauri-apps/api/window"

export const tauri = !!(window as any).__TAURI__

export async function openDialog(): Promise<string | null> {
  const selected = await open({
    filters: [
      {
        name: "RTF Document",
        extensions: ["rtf"],
      },
    ],
  })

  if (selected === null || Array.isArray(selected)) {
    return null
  }
  return selected
}

export async function saveDialog(): Promise<string> {
  return await save({
    filters: [
      {
        name: "RTF Document",
        extensions: ["rtf"],
      },
    ],
  })
}

export async function splitPath(path: string): Promise<[string, string]> {
  const p = await resolve(path)
  const dir = await dirname(p)
  const file = await basename(p)
  return [dir, file]
}

export async function readFile(path: string): Promise<string> {
  return await readTextFile(path)
}

export async function saveFile(path: string, contents: string): Promise<void> {
  return await writeTextFile(path, contents)
}

export async function showError(err: string, title?: string): Promise<void> {
  return await message(err, { title, type: "error" })
}

export function confirmClose() {
  ask("Unsaved changes may be lost. Are you sure you want to exit?", {
    type: "warning",
  }).then((quit) => {
    if (quit) {
      appWindow.close()
    }
  })
}

export function closeWindow() {
  appWindow.close()
}

export const pathSeparator = sep
