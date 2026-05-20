import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  SelectionMode,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type EdgeMouseHandler,
  type Connection,
  type NodeMouseHandler,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { nodeTypes } from '../nodes'
import { edgeTypes } from '../edges'
import { useStore } from '../../store'
import type { ModuleKey, FlowEdge, FlowNode } from '../../types'

interface FlowCanvasProps {
  module: ModuleKey
  defaultEdgeType?: string
  onNodeClick?: NodeMouseHandler
}

export default function FlowCanvas({ module, defaultEdgeType = 'normal', onNodeClick }: FlowCanvasProps) {
  const nodes = useStore((s) => s[module].nodes)
  const edges = useStore((s) => s[module].edges)
  const setNodes = useStore((s) => s.setNodes)
  const setEdges = useStore((s) => s.setEdges)
  const addEdgeToStore = useStore((s) => s.addEdge)
  const setSelectedNode = useStore((s) => s.setSelectedNode)
  const setSelectedEdge = useStore((s) => s.setSelectedEdge)

  const onNodesChange = useCallback<OnNodesChange>(
    (changes) => {
      const removedIds = changes.filter((c) => c.type === 'remove').map((c) => c.id)
      setNodes(module, applyNodeChanges(changes, nodes) as FlowNode[])
      if (removedIds.length) {
        setEdges(module, edges.filter((e) => !removedIds.includes(e.source) && !removedIds.includes(e.target)) as FlowEdge[])
      }
    },
    [module, nodes, edges, setNodes, setEdges],
  )

  const onEdgesChange = useCallback<OnEdgesChange>(
    (changes) => {
      setEdges(module, applyEdgeChanges(changes, edges) as FlowEdge[])
    },
    [module, edges, setEdges],
  )

  const onConnect = useCallback<OnConnect>(
    (params: Connection) => {
      const newEdge: FlowEdge = {
        ...params,
        id: `e-${params.source}-${params.target}-${Date.now()}`,
        type: defaultEdgeType,
      }
      addEdgeToStore(module, newEdge)
    },
    [module, defaultEdgeType, addEdgeToStore],
  )

  const handleNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      setSelectedNode(module, node.id)
      onNodeClick?.(event, node)
    },
    [module, setSelectedNode, onNodeClick],
  )

  const handleEdgeClick: EdgeMouseHandler = useCallback(
    (_event, edge) => {
      setSelectedEdge(module, edge.id)
    },
    [module, setSelectedEdge],
  )

  const handlePaneClick = useCallback(() => {
    setSelectedNode(module, null)
    setSelectedEdge(module, null)
  }, [module, setSelectedNode, setSelectedEdge])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={handleNodeClick}
      onEdgeClick={handleEdgeClick}
      onPaneClick={handlePaneClick}
      deleteKeyCode={['Delete', 'Backspace']}
      multiSelectionKeyCode="Shift"
      selectionOnDrag
      panOnDrag={[1, 2]}
      selectionMode={SelectionMode.Partial}
      fitView
      panOnScroll
      zoomOnPinch
      minZoom={0.2}
      maxZoom={3}
      defaultEdgeOptions={{ type: defaultEdgeType }}
    >
      <Background variant={BackgroundVariant.Dots} gap={16} size={1} className="dark:bg-gray-950" />
      <Controls className="dark:bg-gray-800 dark:text-white dark:border-gray-600" />
      <MiniMap className="dark:bg-gray-800" nodeStrokeWidth={3} />
    </ReactFlow>
  )
}
