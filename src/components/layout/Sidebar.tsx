import { Square, Circle, Triangle, X as XIcon, GraduationCap } from 'lucide-react'
import type { ReactNode } from 'react'
import type { NodeType, ModuleKey } from '../../types'

interface NodeTool {
  type: NodeType
  label: string
  icon: ReactNode
  color: string
}

const genoTools: NodeTool[] = [
  { type: 'male', label: 'Hombre', icon: <Square className="w-5 h-5" />, color: 'bg-blue-100 border-blue-400 dark:bg-blue-900 dark:border-blue-500' },
  { type: 'female', label: 'Mujer', icon: <Circle className="w-5 h-5" />, color: 'bg-pink-100 border-pink-400 dark:bg-pink-900 dark:border-pink-500' },
  { type: 'pregnancy', label: 'Embarazo', icon: <Triangle className="w-5 h-5" />, color: 'bg-yellow-100 border-yellow-400 dark:bg-yellow-900 dark:border-yellow-500' },
  { type: 'deceased', label: 'Fallecido', icon: <XIcon className="w-5 h-5" />, color: 'bg-gray-100 border-gray-400 dark:bg-gray-700 dark:border-gray-500' },
]

const socioTools: NodeTool[] = [
  { type: 'student', label: 'Alumno', icon: <GraduationCap className="w-5 h-5" />, color: 'bg-violet-100 border-violet-400 dark:bg-violet-900 dark:border-violet-500' },
]

interface SidebarProps {
  module: ModuleKey
  onAddNode: (type: NodeType) => void
}

export default function Sidebar({ module, onAddNode }: SidebarProps) {
  const tools = module === 'sociograma' ? socioTools : genoTools

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, type: NodeType) => {
    e.dataTransfer.setData('application/psicomap-node', type)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="hidden md:flex flex-col w-56 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 gap-2 shrink-0">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1 mb-1">
        Nodos
      </p>
      {tools.map((tool) => (
        <div
          key={tool.type}
          draggable
          onDragStart={(e) => onDragStart(e, tool.type)}
          onClick={() => onAddNode(tool.type)}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-grab active:cursor-grabbing select-none transition-opacity hover:opacity-80 ${tool.color}`}
        >
          {tool.icon}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{tool.label}</span>
        </div>
      ))}
    </aside>
  )
}
