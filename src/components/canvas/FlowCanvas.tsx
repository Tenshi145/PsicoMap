import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type OnConnect,
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

  const handlePaneClick = useCallback(() => {
    setSelectedNode(module, null)
  }, [module, setSelectedNode])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={(changes) => {
        // Apply position changes from drag
        const updated = nodes.map((n) => {
          const change = changes.find((c) => c.type === 'position' && c.id === n.id)
          if (change && change.type === 'position' && change.position) {
            return { ...n, position: change.position }
          }
          return n
        })
        setNodes(module, updated as FlowNode[])
      }}
      onEdgesChange={(changes) => {
        const removed = changes.filter((c) => c.type === 'remove').map((c) => c.id)
        if (removed.length) {
          setEdges(module, edges.filter((e) => !removed.includes(e.id)) as FlowEdge[])
        }
      }}
      onConnect={onConnect}
      onNodeClick={handleNodeClick}
      onPaneClick={handlePaneClick}
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
