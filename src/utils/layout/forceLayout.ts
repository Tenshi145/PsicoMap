import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
} from 'd3-force'
import type { FlowNode, Relation } from '../../types'

export function applyForceLayout(nodes: FlowNode[], relations: Relation[]): FlowNode[] {
  const width = 800
  const height = 600

  const simNodes = nodes.map((n) => ({
    id: n.id,
    x: width / 2 + (Math.random() - 0.5) * 200,
    y: height / 2 + (Math.random() - 0.5) * 200,
  }))

  const links = relations.map((r) => ({ source: r.from, target: r.to }))

  const simulation = forceSimulation(simNodes as any)
    .force('link', forceLink(links).id((d: any) => d.id).distance(120).strength(0.5))
    .force('charge', forceManyBody().strength(-300))
    .force('center', forceCenter(width / 2, height / 2))
    .force('collide', forceCollide(50))
    .stop()

  // Run synchronously
  simulation.tick(300)

  const posMap = new Map(simNodes.map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }]))

  return nodes.map((n) => ({
    ...n,
    position: posMap.get(n.id) ?? { x: 0, y: 0 },
  }))
}
