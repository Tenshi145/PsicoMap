import { describe, it, expect } from 'vitest'
import { applyDagreLayout } from './dagreLayout'
import type { FlowNode, FlowEdge } from '../../types'

const nodes: FlowNode[] = [
  { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A', nodeType: 'male' } },
  { id: 'b', position: { x: 0, y: 0 }, data: { label: 'B', nodeType: 'female' } },
  { id: 'c', position: { x: 0, y: 0 }, data: { label: 'C', nodeType: 'male' } },
]

const edges: FlowEdge[] = [
  { id: 'e1', source: 'a', target: 'b' },
  { id: 'e2', source: 'b', target: 'c' },
]

describe('applyDagreLayout', () => {
  it('returns same number of nodes', () => {
    const result = applyDagreLayout(nodes, edges)
    expect(result).toHaveLength(3)
  })

  it('assigns different y positions to nodes in different levels', () => {
    const result = applyDagreLayout(nodes, edges)
    const ys = result.map((n) => n.position.y)
    expect(new Set(ys).size).toBeGreaterThan(1)
  })

  it('node a is above node c (a → b → c)', () => {
    const result = applyDagreLayout(nodes, edges)
    const aY = result.find((n) => n.id === 'a')!.position.y
    const cY = result.find((n) => n.id === 'c')!.position.y
    expect(aY).toBeLessThan(cY)
  })
})
