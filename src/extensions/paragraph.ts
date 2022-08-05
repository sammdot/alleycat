import BaseParagraph from "@tiptap/extension-paragraph"

export const Paragraph = BaseParagraph.extend({
  addAttributes() {
    return {
      style: {
        default: "normal",
        parseHTML: (el) => el.getAttribute("acat-style"),
        renderHTML: (attrs) => {
          return {
            "acat-style": attrs.style,
          }
        },
      },
    }
  },

  addCommands(): any {
    return {
      setParagraphStyle:
        (style: string) =>
        ({ commands }: any) => {
          commands.updateAttributes("paragraph", { style })
        },
    }
  },
})
