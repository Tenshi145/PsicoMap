import { describe, it, expectTypeOf } from 'vitest'
import type { NodeMeta, FlowModuleState, Relation } from './types'

describe('types', () => {
  it('NodeMeta has required fields', () => {
    expectTypeOf<NodeMeta>().toHaveProperty('label')
    expectTypeOf<NodeMeta>().toHaveProperty('nodeType')
  })
  it('Relation type union', () => {
    expectTypeOf<Relation['type']>().toEqualTypeOf<'positive' | 'negative'>()
  })
  it('FlowModuleState shape', () => {
    expectTypeOf<FlowModuleState>().toHaveProperty('nodes')
    expectTypeOf<FlowModuleState>().toHaveProperty('edges')
    expectTypeOf<FlowModuleState>().toHaveProperty('selectedNodeId')
  })
})
