import { Trash2 } from 'lucide-react'
import { useStore } from '../../store'
import ColorPicker from './ColorPicker'
import type { ModuleKey } from '../../types'

const NODE_PRESETS = ['#fecaca', '#fed7aa', '#fef08a', '#bbf7d0', '#bfdbfe', '#e9d5ff', '#fbcfe8', '#e5e7eb']

const NODE_DEFAULT_COLORS: Record<string, string> = {
  male: '#dbeafe',
  female: '#fce7f3',
  pregnancy: '#fef9c3',
  deceased: '#e5e7eb',
  student: '#ede9fe',
}

interface NodeMetaFormProps {
  module: ModuleKey
  nodeId: string
}

export default function NodeMetaForm({ module, nodeId }: NodeMetaFormProps) {
  const node = useStore((s) => s[module].nodes.find((n) => n.id === nodeId))
  const updateNodeMeta = useStore((s) => s.updateNodeMeta)
  const removeNode = useStore((s) => s.removeNode)

  if (!node) return null
  const data = node.data

  const update = (field: string, value: string | number) =>
    updateNodeMeta(module, nodeId, { [field]: value })

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nombre</label>
        <input
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={data.label}
          onChange={(e) => update('label', e.target.value)}
          placeholder="Nombre completo"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Edad</label>
        <input
          type="number"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={data.age ?? ''}
          onChange={(e) => update('age', Number(e.target.value))}
          placeholder="Años"
          min={0}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Ocupación</label>
        <input
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={data.occupation ?? ''}
          onChange={(e) => update('occupation', e.target.value)}
          placeholder="Profesión u ocupación"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Notas clínicas</label>
        <textarea
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          value={data.medicalNotes ?? ''}
          onChange={(e) => update('medicalNotes', e.target.value)}
          placeholder="Diagnósticos, observaciones, etc."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Color</label>
        <ColorPicker
          value={data.color}
          defaultColor={NODE_DEFAULT_COLORS[data.nodeType] ?? '#e5e7eb'}
          presets={NODE_PRESETS}
          onChange={(c) => updateNodeMeta(module, nodeId, { color: c })}
        />
      </div>
      <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => removeNode(module, nodeId)}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar figura
        </button>
      </div>
    </div>
  )
}
