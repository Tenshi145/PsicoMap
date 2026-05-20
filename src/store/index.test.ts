import { describe, it, expect, beforeEach } from 'vitest'
import { useStore, initialState } from './index'

beforeEach(() => {
  useStore.setState(initialState)
})

describe('app state', () => {
  it('toggleTheme switches light → dark', () => {
    useStore.getState().toggleTheme()
    expect(useStore.getState().theme).toBe('dark')
  })

  it('toggleTheme switches dark → light', () => {
    useStore.setState({ theme: 'dark' })
    useStore.getState().toggleTheme()
    expect(useStore.getState().theme).toBe('light')
  })
})

describe('addNode', () => {
  it('adds node to genograma', () => {
    const node = { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Juan', nodeType: 'male' as const } }
    useStore.getState().addNode('genograma', node)
    expect(useStore.getState().genograma.nodes).toHaveLength(1)
  })

  it('adds node to familiograma independently', () => {
    const node = { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Ana', nodeType: 'female' as const } }
    useStore.getState().addNode('familiograma', node)
    expect(useStore.getState().familiograma.nodes).toHaveLength(1)
    expect(useStore.getState().genograma.nodes).toHaveLength(0)
  })
})

describe('removeNode', () => {
  it('removes node and its connected edges', () => {
    useStore.setState({
      genograma: {
        nodes: [{ id: 'n1', position: { x: 0, y: 0 }, data: { label: 'A', nodeType: 'male' as const } }],
        edges: [{ id: 'e1', source: 'n1', target: 'n2' }],
        selectedNodeId: null,
      },
    })
    useStore.getState().removeNode('genograma', 'n1')
    expect(useStore.getState().genograma.nodes).toHaveLength(0)
    expect(useStore.getState().genograma.edges).toHaveLength(0)
  })
})

describe('updateNodeMeta', () => {
  it('merges partial meta into node data', () => {
    useStore.setState({
      genograma: {
        nodes: [{ id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Juan', nodeType: 'male' as const } }],
        edges: [],
        selectedNodeId: null,
      },
    })
    useStore.getState().updateNodeMeta('genograma', 'n1', { age: 42 })
    expect(useStore.getState().genograma.nodes[0].data.age).toBe(42)
  })
})

describe('sociograma', () => {
  it('addStudent appends student', () => {
    useStore.getState().addStudent({ id: 's1', name: 'Lucía' })
    expect(useStore.getState().sociograma.students).toHaveLength(1)
  })

  it('addRelation appends relation', () => {
    useStore.getState().addRelation({ from: 's1', to: 's2', type: 'positive' })
    expect(useStore.getState().sociograma.relations).toHaveLength(1)
  })

  it('removeRelation removes matching pair', () => {
    useStore.setState({
      sociograma: {
        ...initialState.sociograma,
        relations: [{ from: 's1', to: 's2', type: 'positive' as const }],
      },
    })
    useStore.getState().removeRelation('s1', 's2')
    expect(useStore.getState().sociograma.relations).toHaveLength(0)
  })
})
