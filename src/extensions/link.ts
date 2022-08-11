import { Extension } from "@tiptap/core"

import { LinkData } from "src/models/link"

declare module "@tiptap/core" {
  interface Commands {
    ploverLinkExtension: {
      locateTranslation: (data: LinkData) => boolean
      addTranslation: (data: LinkData) => boolean
    }
  }
}

export const PloverLink = Extension.create({
  addCommands(): any {
    return {
      locateTranslation:
        (data: LinkData) =>
        ({ editor, commands: c }: any) => {
          // TODO: The input was entered in AlleyCAT; find how much was entered
          // and wrap that in a translation object.
          let { timestamp, translated, sent, stroked, is_correction } = data
          let { from } = translated
          if (from.length !== 0) {
            // TODO
            return true
          }

          if (is_correction) {
            return true
          }

          let outputEnd = editor.state.selection.$head.pos

          for (let item of sent) {
            if (item.type === "string") {
              let { string: text } = item

              if (text.includes("\n")) {
                // TODO
                continue
              }

              let length = text.length
              c.setTextSelection({
                from: outputEnd - length,
                to: outputEnd + 1,
              })
              c.insertContent([
                {
                  type: "translation",
                  content: [
                    { type: "stroke", attrs: { steno: stroked, timestamp } },
                    { type: "text", text },
                  ],
                },
              ])
            } else if (item.type === "backspaces") {
              // TODO
              continue
            } else if (item.type === "key_combo") {
              // Ignore key combinations on purpose
              continue
            }
          }

          return true
        },
      addTranslation:
        (data: LinkData) =>
        ({ commands: c }: any) => {
          // TODO: The input was entered outside AlleyCAT; create a translation
          // object and add it to the document.
          let { timestamp, translated, sent, stroked, is_correction } = data
          let { from } = translated
          if (from.length !== 0) {
            // TODO
            return true
          }

          if (is_correction) {
            return true
          }

          for (let item of sent) {
            if (item.type === "string") {
              let { string: text } = item

              if (text.includes("\n")) {
                // TODO
                continue
              }

              c.focus("end")
              c.insertContent([
                {
                  type: "translation",
                  content: [
                    { type: "stroke", attrs: { steno: stroked, timestamp } },
                    { type: "text", text },
                  ],
                },
              ])
            } else if (item.type === "backspaces") {
              // TODO
              continue
            } else if (item.type === "key_combo") {
              // Ignore key combinations on purpose
              continue
            }
          }
          return true
        },
    }
  },
})
