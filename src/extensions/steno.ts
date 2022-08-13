import { Node } from "@tiptap/core"

type Options = { HTMLAttributes: Record<string, any> }

export const Output = Node.create<Options>({
  name: "output",
  group: "inline",
  content: "text* translation text*",
  inline: true,
  selectable: false,
  draggable: false,

  addAttributes() {
    return {
      actions: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: "acat-out" }]
  },

  renderHTML({ HTMLAttributes }: any) {
    return ["acat-out", HTMLAttributes, 0]
  },
})

export const Translation = Node.create<Options>({
  name: "translation",
  group: "inline",
  content: "outline text? untranslate?",
  inline: true,
  selectable: false,
  draggable: false,

  addAttributes() {
    return {
      orig: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: "acat-tl" }]
  },

  renderHTML({ HTMLAttributes }: any) {
    return ["acat-tl", HTMLAttributes, 0]
  },
})

export const Outline = Node.create<Options>({
  name: "outline",
  group: "inline",
  content: "stroke+",
  marks: "",
  inline: true,
  selectable: false,
  draggable: false,

  parseHTML() {
    return [{ tag: "acat-ol" }]
  },

  renderHTML({ HTMLAttributes }: any) {
    return ["acat-ol", HTMLAttributes, 0]
  },
})

export const Stroke = Node.create<Options>({
  name: "stroke",
  group: "inline",
  marks: "",
  inline: true,
  selectable: false,
  draggable: false,
  atom: true,

  addAttributes() {
    return {
      steno: { default: null },
      timecode: {
        default: null,
        parseHTML: (el) => el.getAttribute("tcode"),
        renderHTML: (attrs) => {
          if (!attrs.timecode) {
            return {}
          }
          return { tcode: attrs.timecode }
        },
      },
      timestamp: {
        default: null,
        parseHTML: (el) => el.getAttribute("time"),
        renderHTML: (attrs) => {
          if (!attrs.timestamp) {
            return {}
          }
          return { time: attrs.timestamp }
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: "acat-strk" }]
  },

  renderHTML({ HTMLAttributes }: any) {
    return ["acat-strk", HTMLAttributes, 0]
  },
})

export const Untranslate = Node.create<Options>({
  name: "untranslate",
  groups: "inline",
  content: "text*",
  marks: "",
  inline: true,
  selectable: true,
  draggable: false,

  parseHTML() {
    return [{ tag: "acat-untr" }]
  },

  renderHTML({ HTMLAttributes }: any) {
    return ["acat-untr", HTMLAttributes, 0]
  },
})
