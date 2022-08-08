export type Settings = {
  theme: "light" | "dark" | null
  fontSize: number
}

export type SettingsHooks = {
  [K in keyof Settings]: [Settings[K], (val: Settings[K]) => void]
}

export const defaultSettings: Settings = {
  theme: null,
  fontSize: 16,
}
