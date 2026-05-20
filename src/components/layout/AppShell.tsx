import { useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useStore } from '../../store'
import Sidebar from './Sidebar'
import BottomDrawer from './BottomDrawer'
import MetaPanel from './MetaPanel'
import ThemeToggle from '../ui/ThemeToggle'
import ExportButton from '../ui/ExportButton'
import FlowCanvas from '../canvas/FlowCanvas'
import type { ModuleKey, NodeType } from '../../types'

interface AppShellProps {
  module: ModuleKey
  title: string
  defaultEdgeType?: string
  topBarExtra?: ReactNode
}

export default function AppShell({ module, title, defaultEdgeType, topBarExtra }: AppShellProps) {
  const navigate = useNavigate()
  const setIsMobile = useStore((s) => s.setIsMobile)
  const addNode = useStore((s) => s.addNode)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [setIsMobile])

  const handleAddNode = useCallback((type: NodeType) => {
    const id = `${type}-${Date.now()}`
    addNode(module, {
      id,
      type,
      position: { x: 300 + Math.random() * 100, y: 200 + Math.random() * 100 },
      data: { label: type.charAt(0).toUpperCase() + type.slice(1), nodeType: type },
    })
  }, [module, addNode])

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-950">
      {/* Top bar */}
      <header className="flex items-center gap-3 px-4 h-14 border-b border-gray-200 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-900 z-10">
        <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-gray-900 dark:text-white flex-1">{title}</h1>
        {topBarExtra}
        <ExportButton canvasElementId="psicomap-canvas" filename={module} />
        <ThemeToggle />
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar module={module} onAddNode={handleAddNode} />
        <div id="psicomap-canvas" className="flex-1 h-full">
          <FlowCanvas module={module} defaultEdgeType={defaultEdgeType} />
        </div>
        <MetaPanel module={module} />
      </div>

      {/* Mobile bottom drawer */}
      <BottomDrawer module={module} onAddNode={handleAddNode} />
    </div>
  )
}
