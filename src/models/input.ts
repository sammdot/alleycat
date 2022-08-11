import { Content } from "src/models/document"

function splitTextInline(input: string): string[] {
  let parts: string[] = []
  let text = input.slice()

  if (text.startsWith("Q.")) {
    text = text.slice(2)
    parts.push("Q.")
  } else if (text.startsWith("A.")) {
    text = text.slice(2)
    parts.push("A.")
  }

  if (text.startsWith(" ")) {
    let trimmed = text.trimStart()
    parts.push(new Array(text.length - trimmed.length).fill(" ").join(""))
    text = trimmed
  }

  if (text.endsWith(" ")) {
    let trimmed = text.trimEnd()
    parts.push(trimmed)
    parts.push(new Array(text.length - trimmed.length).fill(" ").join(""))
  } else {
    parts.push(text)
  }

  return parts
}

export function splitText(input: string): (string | string[])[] {
  if (input === "") {
    return []
  }
  if (input === "\n") {
    return ["\n"]
  }

  if (input.includes("\n")) {
    let parts: (string | string[])[] = []
    // Automatically handle double-spacing before a Q. or A.
    let lines = input.split(/\n+/)
    parts = parts.concat(splitTextInline(lines.shift()!))
    for (let line of lines) {
      parts.push(splitTextInline(line))
    }
    return parts
  }

  return splitTextInline(input)
}

function _toContent(input: string): Content | null {
  if (input === "") {
    return null
  }

  return { type: "text", text: input }
}

export function toContent(parts: (string | string[])[]): Content {
  let nodes: Content = []
  for (let part of parts) {
    if (Array.isArray(part)) {
      let para = {
        type: "paragraph",
        attrs: {
          style: "normal",
        },
        content: [] as Content,
      }
      if (part[0] === "Q.") {
        part.shift()
        para.attrs.style = "question"
      } else if (part[0] === "A.") {
        part.shift()
        para.attrs.style = "answer"
      }
      para.content = toContent(part)
      nodes.push(para)
    } else {
      let node = _toContent(part)
      if (node === null) {
        continue
      }
      nodes.push(node)
    }
  }

  return nodes
}
