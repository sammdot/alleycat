import { Node, ResolvedPos } from "prosemirror-model"

type NodeInfo = [Node, ResolvedPos, number]

export function allOutputs(node: Node): NodeInfo[] {
  let outputs: NodeInfo[] = []
  node.content.descendants((n, pos) => {
    if (n.type.name !== "output") {
      return
    }
    outputs.push([n, node.resolve(pos), n.nodeSize])
  })
  return outputs
}

export function allNodesNamed(name: string, node: Node): NodeInfo[] {
  let out: NodeInfo[] = []
  node.content.descendants((n, pos) => {
    if (n.type.name === name) {
      out.push([n, node.resolve(pos), n.nodeSize])
      return false
    }
  })
  return out
}

export function hasChildNamed(name: string, node: Node): boolean {
  let hasChild = false
  node.content.descendants((n) => {
    if (n.type.name === name) {
      hasChild = true
      return
    }
  })
  return hasChild
}

export function lastOutput(node: Node): NodeInfo | null {
  let out = allOutputs(node)
  return out[out.length - 1]
}

export function lastNonEmptyOutput(node: Node): NodeInfo[] {
  let nodes = allOutputs(node)
  let out: NodeInfo[] = []
  for (let i = nodes.length - 1; i >= 0; i--) {
    let [node] = nodes[i]

    out.unshift(nodes[i])
    if (hasChildNamed("text", node)) {
      break
    }
  }
  return out
}

export function lastOutputsWithActions(
  num: number,
  node: Node
): NodeInfo[] | null {
  let nodes = allOutputs(node)
  let totalActions = num
  let out: NodeInfo[] = []
  for (let i = nodes.length - 1; i >= 0; i--) {
    let [node] = nodes[i]
    if (!node.attrs.actions) {
      continue
    }

    out.push(nodes[i])
    totalActions -= parseInt(node.attrs.actions)
    if (totalActions <= 0) {
      return out
    }
  }
  return null
}

export function childrenNamed(name: string, node: Node): Node[] {
  let nodes: Node[] = []
  node.content.descendants((n, pos) => {
    if (n.type.name !== name) {
      return
    }
    nodes.push(n)
  })
  return nodes
}

export function textSelectionIn(
  node: Node,
  range: { from: number; to: number }
): { from: number; to: number } {
  let from: number | null = null,
    to: number | null = null
  node.content.nodesBetween(range.from, range.to, (n, pos) => {
    if (n.type.name !== "text") {
      return
    }

    let thisFrom = pos,
      thisTo = pos + n.nodeSize

    from = from === null ? thisFrom : thisFrom < from ? thisFrom : from
    to = to === null ? thisTo : thisTo > to ? thisTo : to
  })
  return { from: from || 0, to: to || 0 }
}
