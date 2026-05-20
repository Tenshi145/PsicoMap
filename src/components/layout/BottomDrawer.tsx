import { Square, Circle, Triangle, X as XIcon, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { useStore } from '../../store'
import type { NodeType, ModuleKey } from '../../types'

interface DrawerTool {
  type: NodeType
  label: string
  icon: ReactNode
  color: string
}

const genoTools: DrawerTool[] = [
  { type: 'male', label: 'Hombre', icon: <Square className="w-6 h-6" />, color: 'text-blue-600' },
  { type: 'female', label: 'Mujer', icon: <Circle className="w-6 h-6" />, color: 'text-pink-600' },
  { type: 'pregnancy', label: 'Embarazo', icon: <Triangle className="w-6 h-6" />, color: 'text-yellow-600' },
  { type: 'deceased', label: 'Fallecido', icon: <XIcon className="w-6 h-6" />, color: 'text-gray-600' },
]

const socioTools: DrawerTool[] = [
  { type: 'student', label: 'Alumno', icon: <GraduationCap className="w-6 h-6" />, color: 'text-violet-600' },
]

interface BottomDrawerProps {
  module: ModuleKey
  onAddNode: (type: NodeType) => void
}

export default function BottomDrawer({ module, onAddNode }: BottomDrawerProps) {
  const isOpen = useStore((s) => s.isBottomDrawerOpen)
  const setOpen = useStore((s) => s.setBottomDrawerOpen)
  const tools = module === 'sociograma' ? socioTools : genoTools

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      <div className={`bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3.5rem)]'}`}>
        <button
          onClick={() => setOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 h-14 font-medium text-gray-700 dark:text-gray-200"
        >
          <span>Añadir nodo</span>
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
        <div className="flex justify-around items-center px-4 pb-6 pt-2 gap-3">
          {tools.map((tool) => (
            <button
              key={tool.type}
              onClick={() => { onAddNode(tool.type); setOpen(false) }}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 active:scale-95 transition-transform min-w-[64px]"
            >
              <span className={tool.color}>{tool.icon}</span>
              <span className="text-xs text-gray-600 dark:text-gray-300">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
