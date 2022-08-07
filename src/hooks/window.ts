import { useEffect } from "react"

import { setTitle } from "src/platform"

export function useTitle(title: string) {
  useEffect(() => {
    setTitle(title)
  })
}
