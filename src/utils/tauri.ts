import { open } from "@tauri-apps/api/dialog"
import { readTextFile } from "@tauri-apps/api/fs"
import { basename, dirname, resolve, sep } from "@tauri-apps/api/path"

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

export async function splitPath(path: string): Promise<[string, string]> {
  const p = await resolve(path)
  const dir = await dirname(p)
  const file = await basename(p)
  return [dir, file]
}

export async function readFile(path: string): Promise<string> {
  return readTextFile(path)
}

export const pathSeparator = sep
