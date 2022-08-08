export function getFileParam(): string | null {
  return new URLSearchParams(window.location.search).get("file")
}

export function queryString(file: string | null): string {
  if (file === null) {
    return "/"
  }
  return "/?" + new URLSearchParams({ file }).toString()
}
