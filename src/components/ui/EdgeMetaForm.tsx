import { Trash2 } from 'lucide-react'
import { useStore } from '../../store'
import ColorPicker from './ColorPicker'
import type { ModuleKey } from '../../types'

const EDGE_PRESETS = ['#374151', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']

interface EdgeMetaFormProps {
  module: ModuleKey
  edgeId: string
}

export default function EdgeMetaForm({ module, edgeId }: EdgeMetaFormProps) {
  const edge = useStore((s) => (s[module] as { edges: { id: string; data?: Record<string, unknown> }[] }).edges.find((e) => e.id === edgeId))
  const updateEdgeColor = useStore((s) => s.updateEdgeColor)
  const removeEdge = useStore((s) => s.removeEdge)

  if (!edge) return null

  const color = edge.data?.color as string | undefined

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Color de línea</label>
        <ColorPicker
          value={color}
          defaultColor="#374151"
          presets={EDGE_PRESETS}
          onChange={(c) => updateEdgeColor(module, edgeId, c)}
        />
      </div>
      <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => removeEdge(module, edgeId)}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar línea
        </button>
      </div>
    </div>
  )
}
