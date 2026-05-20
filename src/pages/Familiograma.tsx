import { ReactFlowProvider } from '@xyflow/react'
import AppShell from '../components/layout/AppShell'
import { useStore } from '../store'
import { applyDagreLayout } from '../utils/layout/dagreLayout'
import { LayoutGrid } from 'lucide-react'

function FamiliogramaContent() {
  const nodes = useStore((s) => s.familiograma.nodes)
  const edges = useStore((s) => s.familiograma.edges)
  const setNodes = useStore((s) => s.setNodes)

  const applyLayout = () => {
    const laid = applyDagreLayout(nodes, edges)
    setNodes('familiograma', laid)
  }

  const layoutBtn = (
    <button
      onClick={applyLayout}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm font-medium"
    >
      <LayoutGrid className="w-4 h-4" />
      Auto Layout
    </button>
  )

  return <AppShell module="familiograma" title="Familiograma" topBarExtra={layoutBtn} />
}

export default function Familiograma() {
  return (
    <ReactFlowProvider>
      <FamiliogramaContent />
    </ReactFlowProvider>
  )
}
