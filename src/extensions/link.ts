import { Plugin, PluginKey } from "prosemirror-state"
import { Extension } from "@tiptap/core"

import { Content } from "src/models/document"
import { LinkData } from "src/models/link"
import {
  childrenNamed,
  lastNonEmptyOutput,
  lastOutputsWithActions,
} from "src/utils/node"

declare module "@tiptap/core" {
  interface Commands {
    ploverLink: {
      locateTranslation: (data: LinkData) => boolean
      addTranslation: (data: LinkData) => boolean
    }
  }
}

export const PloverLink = Extension.create({
  name: "ploverLink",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("ploverLink"),
        props: {
          handleTextInput(view, from, to, text) {
            console.log("text input", from, to, text)
            return false
          },

          handleKeyPress(view, e) {
            console.log("key press", e)
            return false
          },
        },
      }),
    ]
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.createParagraphNear(),
    }
  },

  addCommands(): any {
    return {
      locateTranslation:
        (data: LinkData) =>
        ({ editor, commands: c }: any) => {
          return true
        },
      addTranslation:
        (data: LinkData) =>
        ({ editor, commands: c }: any) => {
          let doc = editor.state.doc
          let {
            timestamp,
            timecode,
            stroked: steno,
            translated: { from, to },
            outline,
            sent,
          } = data

          if (from.length === 0 && to.length !== 0) {
            // Insert only
            let text = sent
              .map((i) => (i.type === "string" ? i.string : null))
              .filter((i) => i !== null)
              .join("")

            let startSpaces = 0,
              endSpaces = 0
            if (text.startsWith(" ")) {
              let trimmed = text.trimStart()
              startSpaces = text.length - trimmed.length
              text = trimmed
            }
            if (text.endsWith(" ")) {
              let trimmed = text.trimEnd()
              endSpaces = text.length - trimmed.length
              text = trimmed
            }

            let content: Content[] = []
            if (startSpaces) {
              content.push({
                type: "text",
                text: new Array(startSpaces).fill(" ").join(),
              })
            }

            let isUntran = !outline?.translation

            content.push({
              type: "translation",
              content: [
                {
                  type: "outline",
                  attrs: { orig: text },
                  content: [
                    {
                      type: "stroke",
                      attrs: {
                        steno,
                        timestamp,
                        timecode,
                      },
                    },
                  ],
                },
                isUntran
                  ? {
                      type: "untranslate",
                      content: [{ type: "text", text: steno }],
                    }
                  : { type: "text", text },
              ],
            })

            if (endSpaces) {
              content.push({
                type: "text",
                text: new Array(endSpaces).fill(" ").join(),
              })
            }

            c.focus("end")
            c.insertContent({
              type: "output",
              attrs: { actions: to.length },
              content,
            })
          } else if (from.length !== 0 && to.length === 0) {
            // Delete only
            let lastOuts = lastNonEmptyOutput(doc)
            if (lastOuts === null) {
              return true
            }

            let strokes = lastOuts
              .flatMap(([n]) => childrenNamed("stroke", n))
              .map((n) => n.toJSON())
            strokes.push({
              type: "stroke",
              attrs: { steno, timestamp, timecode },
            })

            let [, { pos: firstPos }] = lastOuts[0]
            let [, { pos: lastPos }, lastSize] = lastOuts[lastOuts.length - 1]

            c.focus()
            c.setTextSelection({
              from: firstPos,
              to: lastPos + lastSize + 1,
            })
            c.insertContent({
              type: "output",
              actions: 0,
              content: [
                {
                  type: "translation",
                  content: [{ type: "outline", content: strokes }],
                },
              ],
            })
            c.focus("end")
          } else if (from.length <= to.length) {
            // Replacing one translation with another
            let lastOuts = lastOutputsWithActions(from.length, doc)
            if (lastOuts === null) {
              return true
            }

            let backspaces = sent
              .map((i) => (i.type === "backspaces" ? i.backspaces : 0))
              .reduce((p, a) => p + a, 0)

            let nodes = lastOuts
              .flatMap(([n]) => childrenNamed("stroke", n))
              .map((n) => n.toJSON())
            let text = lastOuts
              .flatMap(([n]) => childrenNamed("text", n))
              .map((n) => n.text)
              .join("")
            if (backspaces) {
              text = text.slice(0, text.length - backspaces)
            }
            text += sent
              .map((i) => (i.type === "string" ? i.string : null))
              .filter((i) => i !== null)
              .join("")

            nodes.push({
              type: "stroke",
              attrs: { steno, timestamp, timecode },
            })

            let startSpaces = 0,
              endSpaces = 0
            if (text.startsWith(" ")) {
              let trimmed = text.trimStart()
              startSpaces = text.length - trimmed.length
              text = trimmed
            }
            if (text.endsWith(" ")) {
              let trimmed = text.trimEnd()
              endSpaces = text.length - trimmed.length
              text = trimmed
            }

            let content: Content[] = []
            if (startSpaces) {
              content.push({
                type: "text",
                text: new Array(startSpaces).fill(" ").join(),
              })
            }

            content.push({
              type: "translation",
              content: [
                { type: "outline", content: nodes },
                { type: "text", text },
              ],
            })

            if (endSpaces) {
              content.push({
                type: "text",
                text: new Array(endSpaces).fill(" ").join(),
              })
            }

            let [, { pos: firstPos }] = lastOuts[0]
            let [, { pos: lastPos }, lastSize] = lastOuts[lastOuts.length - 1]
            c.focus()
            c.setTextSelection({
              from: firstPos,
              to: lastPos + lastSize + 1,
            })

            c.insertContent({
              type: "output",
              attrs: {
                actions:
                  lastOuts
                    .map(([n]) => n.attrs.actions || 0)
                    .reduce((p, a) => p + a, 0) -
                  from.length +
                  to.length,
              },
              content,
            })
            c.focus("end")
          } else {
            // TODO
          }

          return true
        },
    }
  },
})
