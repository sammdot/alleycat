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
        ({ commands }: any) => {
          // TODO: The input was entered in AlleyCAT; find how much was entered
          // and wrap that in a translation object.
          return true
        },
      addTranslation:
        (data: LinkData) =>
        ({ commands }: any) => {
          // TODO: The input was entered outside AlleyCAT; create a translation
          // object and add it to the document.
          return true
        },
    }
  },
})
