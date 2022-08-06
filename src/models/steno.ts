export interface StenoKeyList {
  left: string
  middle: string
  right: string
}

export interface StenoTable {
  numberKey: string
  base: StenoKeyList
  shifted: StenoKeyList
}

export const defaultStenoTable: StenoTable = {
  numberKey: "#",
  base: {
    left: "STKPWHR",
    middle: "AO*EU",
    right: "FRPBLGTSDZ",
  },
  shifted: {
    left: "12K3W4R",
    middle: "50*EU",
    right: "6R7B8G9SDZ",
  },
}

function fullKeyList(lst: StenoKeyList): string {
  let { left, middle, right } = lst
  return left + middle + right
}

export function formatSteno(steno: string, table: StenoTable): string | null {
  let str = steno.slice()

  const base = fullKeyList(table.base)
  const shifted = fullKeyList(table.shifted)

  let keys: string = ""

  let hasNumbers = false
  if (/\d/.test(str)) {
    hasNumbers = true
    str = Array.from(str)
      .map((c) => (/\d/.test(c) ? base[shifted.indexOf(c)] : c))
      .join("")
  }

  if (str.includes(table.numberKey)) {
    hasNumbers = true
    str = str.replaceAll(table.numberKey, "")
  }

  keys += hasNumbers ? table.numberKey : " "

  const { left, middle, right } = table.base

  if (!str.startsWith("-")) {
    for (let k of Array.from(left)) {
      if (str.startsWith(k)) {
        str = str.slice(1)
        keys += k
      } else {
        keys += " "
      }
    }

    if (!str.startsWith("-")) {
      for (let k of Array.from(middle)) {
        if (str.startsWith(k)) {
          str = str.slice(1)
          keys += k
        } else {
          keys += " "
        }
      }
    }
  }

  if (str.startsWith("-")) {
    str = str.slice(1)
  }

  for (let k of Array.from(right)) {
    if (str.startsWith(k)) {
      str = str.slice(1)
      keys += k
    } else {
      keys += " "
    }
  }

  if (str.length !== 0) {
    return null
  }

  return keys
}

;(window as any).formatSteno = formatSteno
;(window as any).defaultStenoTable = defaultStenoTable
