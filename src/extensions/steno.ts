import { Node } from "@tiptap/core"

type TranslationOptions = { HTMLAttributes: Record<string, any> }

export const Translation = Node.create<TranslationOptions>({
  name: "translation",
  group: "inline",
  content: "stroke+ text",
  inline: true,
  selectable: true,
  draggable: false,
  atom: true,

  parseHTML() {
    return [{ tag: "acat-tl" }]
  },

  renderHTML({ node, HTMLAttributes }: any) {
    return ["acat-tl", HTMLAttributes, 0]
  },
})

type StrokeOptions = { HTMLAttributes: Record<string, any> }

export const Stroke = Node.create<StrokeOptions>({
  name: "stroke",
  group: "inline",
  content: "text*",
  marks: "",
  inline: true,
  selectable: true,
  draggable: false,
  atom: true,

  addAttributes() {
    return {
      steno: {
        default: null,
        parseHTML: (el) => el.getAttribute("steno"),
        renderHTML: (attrs) => {
          if (!attrs.steno) {
            return {}
          }

          return { steno: attrs.steno }
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

  renderHTML({ node, HTMLAttributes }: any) {
    return ["acat-strk", HTMLAttributes, 0]
  },
})
