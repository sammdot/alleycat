interface StringOutput {
  type: "string"
  string: string
}

interface BackspaceOutput {
  type: "backspaces"
  backspaces: number
}

interface KeyComboOutput {
  type: "key_combo"
  key_combo: string
}

export type OutputItem = StringOutput | BackspaceOutput | KeyComboOutput

export enum Case {
  cap_first_word = "cap_first_word",
  lower = "lower",
  lower_first_char = "lower_first_char",
  title = "title",
  upper = "upper",
  upper_first_word = "upper_first_word",
}

export type TranslationAction = {
  prev_attach: boolean
  prev_replace: string
  glue: boolean
  word: string | null
  orthography: boolean
  space_char: string
  upper_carry: boolean
  case: Case | null
  text: string | null
  trailing_space: string
  word_is_finished: boolean
  combo: string | null
  command: string | null
  next_attach: boolean
  next_case: Case | null
}

export interface LinkData {
  timestamp: number
  timecode: string
  stroked: string
  is_correction: boolean
  outline: {
    steno: string
    translation: string | null
  } | null
  translated: {
    from: TranslationAction[]
    to: TranslationAction[]
  }
  sent: OutputItem[]
}
