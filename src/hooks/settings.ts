import { useEffect, useState } from "react"

import { defaultSettings, Settings } from "src/models/settings"
import { getSetting, setSetting } from "src/platform"

export function useSetting<K extends keyof Settings>(
  key: K
): [Settings[K], (val: Settings[K]) => void, () => void] {
  const [setting, localSetSetting] = useState<Settings[K]>(defaultSettings[key])

  useEffect(() => {
    getSetting(key).then((val) => localSetSetting(val))
  })

  const updateSetting = (val: Settings[K]) => {
    setSetting(key, val).then(() => {
      localSetSetting(val)
    })
  }

  const resetSetting = () => {
    updateSetting(defaultSettings[key])
  }

  return [setting, updateSetting, resetSetting]
}
