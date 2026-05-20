import { X } from 'lucide-react'
import { useStore } from '../../store'
import NodeMetaForm from '../ui/NodeMetaForm'
import EdgeMetaForm from '../ui/EdgeMetaForm'
import type { ModuleKey } from '../../types'

interface MetaPanelProps {
  module: ModuleKey
}

export default function MetaPanel({ module }: MetaPanelProps) {
  const selectedNodeId = useStore((s) => s[module].selectedNodeId)
  const selectedEdgeId = useStore((s) => s[module].selectedEdgeId)
  const setSelectedNode = useStore((s) => s.setSelectedNode)
  const setSelectedEdge = useStore((s) => s.setSelectedEdge)
  const isMobile = useStore((s) => s.isMobile)

  const isNode = !!selectedNodeId
  const isEdge = !isNode && !!selectedEdgeId
  if (!isNode && !isEdge) return null

  const title = isNode ? 'Editar figura' : 'Editar línea'
  const close = () => {
    setSelectedNode(module, null)
    setSelectedEdge(module, null)
  }

  const form = isNode
    ? <NodeMetaForm module={module} nodeId={selectedNodeId!} />
    : <EdgeMetaForm module={module} edgeId={selectedEdgeId!} />

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-end md:hidden" onClick={close}>
        <div
          className="w-full bg-white dark:bg-gray-900 rounded-t-2xl p-5 shadow-2xl max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
            <button onClick={close} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          {form}
        </div>
      </div>
    )
  }

  return (
    <aside className="hidden md:flex flex-col w-72 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 gap-4 shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
        <button onClick={close} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <X className="w-4 h-4" />
        </button>
      </div>
      {form}
    </aside>
  )
}
