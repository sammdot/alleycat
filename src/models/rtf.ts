import { Content, defaultMetadata, Metadata } from "src/models/document"

// TODO: Implement RTF parsing and generation
// These are promises because they will hook into async code in the future

export function fromRTF(rtf: string): Promise<[Content, Metadata]> {
  return new Promise((resolve, reject) => {
    resolve([JSON.parse(rtf), defaultMetadata])
  })
}

export function toRTF(content: Content, metadata: Metadata): Promise<string> {
  return new Promise((resolve, reject) => {
    resolve(JSON.stringify(content))
  })
}
