export type Settings = {
  theme: "light" | "dark" | null
  fontSize: number
  stenoNotesNumbers: boolean
  stenoNotesInline: boolean
}

export type SettingsHooks = {
  [K in keyof Settings]: [Settings[K], (val: Settings[K]) => void]
}

export const defaultSettings: Settings = {
  theme: null,
  fontSize: 16,
  stenoNotesNumbers: false,
  stenoNotesInline: false,
}
