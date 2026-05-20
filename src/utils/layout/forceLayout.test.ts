import { describe, it, expect } from 'vitest'
import { applyForceLayout } from './forceLayout'
import type { FlowNode, Relation } from '../../types'

const nodes: FlowNode[] = [
  { id: 's1', position: { x: 0, y: 0 }, data: { label: 'A', nodeType: 'student' } },
  { id: 's2', position: { x: 0, y: 0 }, data: { label: 'B', nodeType: 'student' } },
  { id: 's3', position: { x: 0, y: 0 }, data: { label: 'C', nodeType: 'student' } },
]

const relations: Relation[] = [
  { from: 's1', to: 's2', type: 'positive' },
  { from: 's3', to: 's2', type: 'positive' },
]

describe('applyForceLayout', () => {
  it('returns same number of nodes', () => {
    const result = applyForceLayout(nodes, relations)
    expect(result).toHaveLength(3)
  })

  it('all nodes receive numeric positions', () => {
    const result = applyForceLayout(nodes, relations)
    result.forEach((n) => {
      expect(typeof n.position.x).toBe('number')
      expect(typeof n.position.y).toBe('number')
      expect(isNaN(n.position.x)).toBe(false)
    })
  })
})
