import { useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import AppShell from '../components/layout/AppShell'
import RelationMatrix from '../components/sociogram/RelationMatrix'
import { useStore } from '../store'
import { applyForceLayout } from '../utils/layout/forceLayout'
import { Network, TableProperties } from 'lucide-react'

function SociogramaContent() {
  const [showMatrix, setShowMatrix] = useState(false)
  const students = useStore((s) => s.sociograma.students)
  const relations = useStore((s) => s.sociograma.relations)
  const nodes = useStore((s) => s.sociograma.nodes)
  const setNodes = useStore((s) => s.setNodes)
  const addNode = useStore((s) => s.addNode)

  const applyLayout = () => {
    // Sync students → nodes (add missing student nodes)
    const existingIds = new Set(nodes.map((n) => n.id))
    students.forEach((st) => {
      if (!existingIds.has(st.id)) {
        addNode('sociograma', {
          id: st.id,
          type: 'student',
          position: { x: 0, y: 0 },
          data: { label: st.name, nodeType: 'student' },
        })
      }
    })
    // Re-read nodes from store after potential additions
    const currentNodes = useStore.getState().sociograma.nodes
    const laid = applyForceLayout(currentNodes, relations)
    setNodes('sociograma', laid)
  }

  const topBarExtra = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowMatrix((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm font-medium"
      >
        <TableProperties className="w-4 h-4" />
        Matriz
      </button>
      <button
        onClick={applyLayout}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-100 hover:bg-violet-200 dark:bg-violet-900 dark:hover:bg-violet-800 text-sm font-medium text-violet-800 dark:text-violet-200"
      >
        <Network className="w-4 h-4" />
        Generar
      </button>
    </div>
  )

  return (
    <>
      <AppShell module="sociograma" title="Sociograma" defaultEdgeType="positive" topBarExtra={topBarExtra} />
      {showMatrix && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowMatrix(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">
              Matriz de relaciones
            </div>
            <RelationMatrix />
          </div>
        </div>
      )}
    </>
  )
}

export default function Sociograma() {
  return (
    <ReactFlowProvider>
      <SociogramaContent />
    </ReactFlowProvider>
  )
}
