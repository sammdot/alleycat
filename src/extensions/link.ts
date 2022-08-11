import { Extension } from "@tiptap/core"

import { Content } from "src/models/document"
import { splitText, toContent } from "src/models/input"
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
          return true
        },
      addTranslation:
        (data: LinkData) =>
        ({ editor, commands: c }: any) => {
          console.log(data)
          let { timestamp, timecode, sent, outline, stroked: steno } = data

          if (!outline) {
            return
          }

          let { steno: full_steno, translation } = outline
          let node: Content = { type: "translation", content: [] }
          for (let item of sent) {
            let act: Content = { type: "action", content: [] }
            if (item.type === "string") {
              let { string: text } = item
              act.content!.push({
                type: "stroke",
                attrs: { steno, timestamp, timecode },
              })
              if (translation) {
                act.content!.push({
                  type: "text",
                  text,
                })
              } else {
                act.content!.push({
                  type: "untranslate",
                  content: [
                    {
                      type: "text",
                      text,
                    },
                  ],
                })
              }
            }
            node.content!.push(act)
          }
          c.focus("end")
          c.insertContent(node)
        },
    }
  },
})
