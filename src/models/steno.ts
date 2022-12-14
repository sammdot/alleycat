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

export function formatStenoInline(
  steno: string,
  table: StenoTable,
  showNumbers: boolean = false
): string {
  let str = steno.slice()

  const base = fullKeyList(table.base)
  const shifted = fullKeyList(table.shifted)

  if (/\d/.test(str) && !showNumbers) {
    str =
      "#" +
      Array.from(str)
        .map((c) => (/\d/.test(c) ? base[shifted.indexOf(c)] : c))
        .join("")
        .replace("#", "")
  }

  return str
}

export function formatSteno(
  steno: string,
  table: StenoTable,
  showNumbers: boolean = false
): string | null {
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

  for (let k of Array.from(left)) {
    if (str.startsWith(k)) {
      str = str.slice(1)
      keys += k
    } else {
      keys += " "
    }
  }

  if (str.startsWith("-")) {
    str = str.slice(1)
    keys += new Array(table.base.middle.length).fill(" ").join("")
  } else {
    for (let k of Array.from(middle)) {
      if (str.startsWith(k)) {
        str = str.slice(1)
        keys += k
      } else {
        keys += " "
      }
    }
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

  if (hasNumbers && showNumbers) {
    let shiftedWithNumbers = table.numberKey + shifted
    keys = Array.from(keys)
      .map((c, i) =>
        /\d/.test(shiftedWithNumbers[i]) && c !== " "
          ? shiftedWithNumbers[i]
          : c
      )
      .join("")
  }

  return keys
}
