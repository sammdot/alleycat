import { Node } from "@tiptap/core"

type TranslationOptions = { HTMLAttributes: Record<string, any> }

export const Translation = Node.create<TranslationOptions>({
  name: "translation",
  group: "inline",
  content: "stroke+ action+",
  inline: true,
  selectable: true,
  draggable: false,
  atom: true,
  locked: true,

  parseHTML() {
    return [{ tag: "acat-tl" }]
  },

  renderHTML({ node, HTMLAttributes }: any) {
    return ["acat-tl", HTMLAttributes, 0]
  },
})

type ActionOptions = { HTMLAttributes: Record<string, any> }

export const Action = Node.create<ActionOptions>({
  name: "action",
  group: "inline",
  content: "(text | untranslate)?",
  inline: true,
  selectable: true,
  draggable: false,
  atom: true,

  parseHTML() {
    return [{ tag: "acat-act" }]
  },

  renderHTML({ node, HTMLAttributes }: any) {
    return ["acat-act", HTMLAttributes, 0]
  },
})

type StrokeOptions = { HTMLAttributes: Record<string, any> }

export const Stroke = Node.create<StrokeOptions>({
  name: "stroke",
  group: "inline",
  marks: "",
  inline: true,
  selectable: true,
  draggable: false,
  atom: true,
  locked: true,

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
      timecode: {
        default: null,
        parseHTML: (el) => el.getAttribute("time-code"),
        renderHTML: (attrs) => {
          if (!attrs.timecode) {
            return {}
          }

          return { "time-code": attrs.timecode }
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

type UntranslateOptions = { HTMLAttributes: Record<string, any> }

export const Untranslate = Node.create<UntranslateOptions>({
  name: "untranslate",
  groups: "inline",
  content: "text*",
  marks: "",
  inline: true,
  selectable: true,
  draggable: false,
  atom: true,
  locked: true,

  parseHTML() {
    return [{ tag: "acat-untran" }]
  },

  renderHTML({ node, HTMLAttributes }: any) {
    return ["acat-untran", HTMLAttributes, 0]
  },
})
