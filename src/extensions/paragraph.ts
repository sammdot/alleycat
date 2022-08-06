import BaseParagraph from "@tiptap/extension-paragraph"

declare module "@tiptap/core" {
  interface Commands {
    customExtension: {
      setParagraphStyle: (style: string) => boolean
    }
  }
}

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
          return true
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      "Alt-z": () => this.editor.commands.setParagraphStyle("normal"),
      "Alt-q": () => this.editor.commands.setParagraphStyle("question"),
      "Alt-a": () => this.editor.commands.setParagraphStyle("answer"),
      "Alt-k": () => this.editor.commands.setParagraphStyle("colloquy"),
      "Alt-b": () => this.editor.commands.setParagraphStyle("byline"),
      "Alt-c": () => this.editor.commands.setParagraphStyle("centered"),
      "Alt-p": () => this.editor.commands.setParagraphStyle("paren"),
      "Alt-x": () => this.editor.commands.setParagraphStyle("quoted"),
    }
  },
})
