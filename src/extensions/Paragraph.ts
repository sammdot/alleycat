import BaseParagraph from "@tiptap/extension-paragraph"

const Paragraph = BaseParagraph.extend({
  addAttributes() {
    return {
      style: {
        default: "normal",
        parseHTML: (element) => element.getAttribute("data-paragraph-style"),
        renderHTML: (attributes) => {
          return {
            "data-paragraph-style": attributes.style,
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

export default Paragraph
